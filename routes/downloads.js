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

// ✅ Ensure this route is defined correctly
router.get("/ppts", async (req, res) => {
    try {
        const params = { Bucket: S3_BUCKET_NAME, Prefix: "ppts/" };
        const data = await s3.listObjectsV2(params).promise();

        if (!data.Contents || data.Contents.length === 0) {
            return res.status(404).json({ message: "No PPTs found in S3 bucket" });
        }

        const ppts = data.Contents.map(file => ({
            name: file.Key.replace("ppts/", ""), // Remove "ppts/" prefix from file names
            url: `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`
        }));

        res.json({ ppts });
    } catch (error) {
        console.error("Error fetching PPTs:", error);
        res.status(500).json({ error: "Failed to retrieve PPTs" });
    }
});

module.exports = router;
