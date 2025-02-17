const express = require("express");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3"); // AWS SDK v3
require("dotenv").config();

const router = express.Router();

// ✅ Ensure AWS credentials are explicitly set
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_BUCKET_NAME) {
    console.error("❌ Missing AWS credentials in environment variables!");
    process.exit(1); // Stop execution if credentials are missing
}

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// ✅ Multer Storage (Store in memory before upload)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const username = req.body.username || "unknown_user";
        const category = req.body.category || "uncategorized";
        const fileName = `${username}/${category}/${Date.now()}-${req.file.originalname}`;

        console.log(`Uploading file: ${fileName}`);

        // ✅ Upload to S3
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: req.file.buffer,  // ✅ Send file as buffer
            ContentType: req.file.mimetype,
        };

        await s3.send(new PutObjectCommand(uploadParams));

        console.log(`✅ File uploaded successfully: ${fileName}`);
        res.json({ message: "File uploaded successfully!", url: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}` });

    } catch (error) {
        console.error("❌ Upload error:", error);
        res.status(500).json({ message: "Upload failed", error: error.message });
    }
});

module.exports = router;
