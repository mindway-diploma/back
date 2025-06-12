import { Request, Response, NextFunction } from "express";
import multer from 'multer';
import multerS3 from 'multer-s3';
import s3 from '../aws-config.js';
import path from 'path';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { uuid } from 'uuidv4';


const uploadToS3 = (savePath: string) => {
    const upload = async (req: any, res: Response, next: NextFunction) => {
        const files = req.files;
        console.log(files);
        if (!files || !Array.isArray(files) || files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const urls: string[] = [];
        for (const file of files) {
            const ext = path.extname(file.originalname);
            const key = `${savePath}/${uuid()}${ext}`;
            const command = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME!,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            });
            await s3.send(command);
            const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
            urls.push(url);
        }
        req.fileUrls = urls;
        next();
    }

    return upload;

}

export default uploadToS3;