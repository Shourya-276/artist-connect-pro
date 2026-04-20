import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const REGION = process.env.AWS_REGION || "ap-south-1";
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "artist-connect-pro";

// Initializing the S3 client
const s3Client = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

/**
 * Upload a file to AWS S3
 * @param fileBuffer - The content of the file
 * @param fileName - The original file name
 * @param mimeType - The file's MIME type
 * @returns The public URL of the uploaded file
 */
export const uploadFileToS3 = async (fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> => {
    // Creating a unique name for the file
    const uniqueFileName = `${Date.now()}-${fileName.replace(/\s+/g, '-')}`;

    // LOCAL STORAGE FALLBACK: If AWS is not configured properly, save locally
    if (!process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID === 'YOUR_AWS_ACCESS_KEY_ID' || process.env.AWS_ACCESS_KEY_ID === '') {
        const uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, uniqueFileName);
        fs.writeFileSync(filePath, fileBuffer);
        return `http://localhost:5001/uploads/${uniqueFileName}`;
    }

    const params = {
        Bucket: BUCKET_NAME,
        Key: `media/${uniqueFileName}`,
        Body: fileBuffer,
        ContentType: mimeType,
    };

    try {
        await s3Client.send(new PutObjectCommand(params));
        // Constructing the public URL manually for simplicity (this requires public-read permissions on the bucket or a CloudFront setup)
        return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/media/${uniqueFileName}`;
    } catch (error: any) {
        console.error("❌ S3 Upload Error:", error);
        throw new Error(`S3 upload failed: ${error.message}`);
    }
};
