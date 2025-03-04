const express = require("express");
const AWS = require("aws-sdk");
const router = express.Router();

// AWS S3 Configuration
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const S3_BUCKET_NAME = "conference-file-storage"; // Your bucket name

// Get the list of all PPTs grouped by speaker folder
router.get("/ppts", async (req, res) => {
    try {
        // Fetch all objects inside "ppts/" folder
        const params = { Bucket: S3_BUCKET_NAME, Prefix: "ppts/" };
        const data = await s3.listObjectsV2(params).promise();

        if (!data.Contents || data.Contents.length === 0) {
            return res.status(404).json({ message: "No PPTs found in S3 bucket" });
        }

        // Organize files by speaker folder
        let speakers = {};

        data.Contents.forEach((file) => {
            const key = file.Key;
            const parts = key.split("/");

            // Skip empty folders
            if (parts.length < 3) return;

            const speakerName = parts[1]; // Extract speaker folder name
            const fileName = parts[2]; // Extract actual file name

            if (!speakers[speakerName]) {
                speakers[speakerName] = [];
            }

            speakers[speakerName].push({
                name: fileName,
                url: `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
            });
        });

        res.json({ speakers });
    } catch (error) {
        console.error("Error fetching PPTs:", error);
        res.status(500).json({ error: "Failed to retrieve PPTs" });
    }
});

module.exports = router;
