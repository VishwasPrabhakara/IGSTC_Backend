const express = require("express");
const AWS = require("aws-sdk");
const router = express.Router();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const S3_BUCKET_NAME = "conference-file-storage"; // Your actual bucket name

router.get("/test-s3", async (req, res) => {
    try {
        const params = { Bucket: S3_BUCKET_NAME };
        const data = await s3.listObjectsV2(params).promise();
        res.json({ message: "S3 Connection Successful!", files: data.Contents });
    } catch (error) {
        console.error("S3 Connection Failed:", error);
        res.status(500).json({ error: "Failed to connect to S3", details: error.message });
    }
});

module.exports = router;
