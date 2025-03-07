const express = require("express");
const AWS = require("aws-sdk");
const router = express.Router();

// AWS S3 Configuration
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const S3_BUCKET_NAME = "conference-file-storage"; // Your actual S3 bucket name

// ✅ Fetch & Sort PPTs from S3
router.get("/ppts", async (req, res) => {
    try {
        const params = { Bucket: S3_BUCKET_NAME, Prefix: "ppts/" };
        const data = await s3.listObjectsV2(params).promise();

        if (!data.Contents || data.Contents.length === 0) {
            return res.status(404).json({ message: "No PPTs found in S3 bucket" });
        }

        // ✅ Sorting by number in filename
        const extractNumber = (filename) => {
            const match = filename.match(/^(\d+)\./); // Extract leading number
            return match ? parseInt(match[1]) : Infinity;
        };

        const ppts = data.Contents
            .filter(file => file.Key !== "ppts/") // Ignore folder entry
            .sort((a, b) => extractNumber(a.Key) - extractNumber(b.Key))
            .map(file => ({
                name: file.Key.replace("ppts/", ""), // Remove folder prefix
                url: s3.getSignedUrl("getObject", { 
                    Bucket: S3_BUCKET_NAME, 
                    Key: file.Key, 
                    Expires: 21600 // Signed URL expires in 6 hours
                })
            }));

        res.json({ ppts });
    } catch (error) {
        console.error("❌ Error fetching PPTs:", error);
        res.status(500).json({ error: "Failed to retrieve PPTs" });
    }
});

// ✅ Fetch & Sort Field Trip Photos from S3
router.get("/field-trip-photos", async (req, res) => {
    try {
        const params = { Bucket: S3_BUCKET_NAME, Prefix: "field-trip-photos/" };
        const data = await s3.listObjectsV2(params).promise();

        if (!data.Contents || data.Contents.length === 0) {
            return res.status(404).json({ message: "No Field Trip Photos found in S3 bucket" });
        }

        // ✅ Sorting by filename
        const photos = data.Contents
            .filter(file => file.Key !== "field-trip-photos/") // Ignore folder entry
            .sort((a, b) => a.Key.localeCompare(b.Key, undefined, { numeric: true }))
            .map(file => ({
                name: file.Key.replace("field-trip-photos/", ""), // Remove folder prefix
                url: s3.getSignedUrl("getObject", { 
                    Bucket: S3_BUCKET_NAME, 
                    Key: file.Key, 
                    Expires: 21600 // Signed URL expires in 6 hours
                })
            }));

        res.json({ photos });
    } catch (error) {
        console.error("❌ Error fetching Field Trip Photos:", error);
        res.status(500).json({ error: "Failed to retrieve Field Trip Photos" });
    }
});

module.exports = router;
