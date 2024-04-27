import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const s3 = new S3Client({
      region: process.env.AWS_REGION || '',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
      }
    });

    const formData = await req.formData();
    const file = formData.getAll('files')[0];

    if (!file) {
      throw new Error('No file found in request.');
    }

    console.log('Received file:', file);

    const params = {
      Bucket: process.env.S3_BUCKET_NAME || '',
      Key: file.name,
      Body: file.buffer
    };

    await s3.send(new PutObjectCommand(params));

    // Log the array received in the request
    const receivedArray = req.body.selectedArray;
    console.log('Array received:', receivedArray);

    return NextResponse.json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    return NextResponse.json({ message: "Failed to upload file to S3" });
  }
}
