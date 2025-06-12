import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../aws-config.js";


const uploadManyToS3 = async (req: any, res: any, next: any) => {
  const { images } = req.body;

  const bufferImages = images.map((image: any) => {
    const base64Data = image.image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    return {
      buffer: buffer,
      originalname: image.name,
      mimetype: image.type,
    };
  });
  console.log(bufferImages);

  const imagesUrls = await Promise.all(
    bufferImages.map(async (image: any) => {
      const key = `posts/${Date.now()}_${image.originalname}`;
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: key,
        Body: image.buffer,
        ContentType: image.mimetype,
      });
      const response = await s3.send(command);
      if (!response) {
        throw new Error("Failed to upload image to S3");
      }

      let fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      return fileUrl;
    })
  );

  req.imagesUrls = imagesUrls;

  next();
};

export default uploadManyToS3;
