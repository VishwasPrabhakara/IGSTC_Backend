const express = require("express");
const AWS = require("aws-sdk");
const router = express.Router();

// AWS S3 Configuration
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const S3_BUCKET_NAME = "conference-file-storage"; // Your actual bucket name

// ✅ Fetch list of all PPTs from S3 (Sorted by Number in Filename)
router.get("/ppts", async (req, res) => {
    try {
        const params = { Bucket: S3_BUCKET_NAME, Prefix: "ppts/" };
        const data = await s3.listObjectsV2(params).promise();

        if (!data.Contents || data.Contents.length === 0) {
            return res.status(404).json({ message: "No PPTs found in S3 bucket" });
        }

        // ✅ Sort by Number Prefix (if exists), otherwise by LastModified
        const ppts = data.Contents
            .filter(file => file.Key !== "ppts/") // Ignore empty folder entry
            .sort((a, b) => {
                const extractNumber = (filename) => {
                    const match = filename.match(/^(\d+)\./); // Extract number before first dot
                    return match ? parseInt(match[1]) : Infinity; // Sort non-numbered files last
                };
                
                return extractNumber(a.Key) - extractNumber(b.Key);
            })
            .map(file => ({
                name: file.Key.replace("ppts/", ""), // Remove "ppts/" prefix
                url: s3.getSignedUrl("getObject", { 
                    Bucket: S3_BUCKET_NAME, 
                    Key: file.Key, 
                    Expires: 3600 // Signed URL expires in 1 hour
                })
            }));

        res.json({ ppts });
    } catch (error) {
        console.error("❌ Error fetching PPTs:", error);
        res.status(500).json({ error: "Failed to retrieve PPTs" });
    }
});

// ✅ Fetch list of all Field Trip Photos from S3
router.get("/field-trip-photos", async (req, res) => {
    try {
        const params = { Bucket: S3_BUCKET_NAME, Prefix: "field-trip-photos/" };
        const data = await s3.listObjectsV2(params).promise();

        if (!data.Contents || data.Contents.length === 0) {
            return res.status(404).json({ message: "No Field Trip Photos found in S3 bucket" });
        }

        // ✅ Generate Signed URLs for all photos
        const photos = data.Contents
            .filter(file => file.Key !== "field-trip-photos/") // Ignore empty folder entry
            .map(file => ({
                name: file.Key.replace("field-trip-photos/", ""), // Remove "field-trip-photos/" prefix
                url: s3.getSignedUrl("getObject", { 
                    Bucket: S3_BUCKET_NAME, 
                    Key: file.Key, 
                    Expires: 3600 // Signed URL expires in 1 hour
                })
            }));

        res.json({ photos });
    } catch (error) {
        console.error("❌ Error fetching Field Trip Photos:", error);
        res.status(500).json({ error: "Failed to retrieve Field Trip Photos" });
    }
});

module.exports = router;
