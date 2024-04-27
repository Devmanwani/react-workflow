import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import csvtojson from 'csvtojson';
import axios from 'axios';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const upload = multer({ dest: '/tmp/' }); // Temporary storage for uploaded files
const s3 = new S3Client({
  region: process.env.AWS_REGION || '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { file, body } = await req.body; // Destructure file and body from request
    const selectedArray = JSON.parse(body.selectedArray);

    if (!file) {
      return res.status(400).json({ message: 'Missing file' });
    }

    const params = {
      Bucket: process.env.S3_BUCKET_NAME || '',
      Key: file.originalname,
      Body: file.buffer,
    };

    await s3.send(new PutObjectCommand(params));

    for (const element of selectedArray) {
      switch (element) {
        case 'filter data':
  // Access the uploaded CSV data (converted to JSON)
  const jsonData = await csvtojson().fromString(file.buffer.toString());

  // Function to convert all column values in an object to lowercase
  const toLowerCaseObject = (obj) => {
    const newObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key.toLowerCase()] = typeof obj[key] === 'string' ? obj[key].toLowerCase() : obj[key];
      }
    }
    return newObj;
  };

  // Apply the conversion function to each object in the JSON array
  const filteredData = jsonData.map(toLowerCaseObject);

  // Now you have the filtered data with lowercase column values in 'filteredData'
  console.log('Filtered data (lowercase):', filteredData);

  // Perform further operations on the filtered data as needed (optional)
  break;
        case 'wait':
          await new Promise(resolve => setTimeout(resolve, 60000));
          break;
        case 'convert':
          const json = await csvtojson().fromString(file.buffer.toString());
          console.log('Converted CSV to JSON:', json);
          // Perform further operations with the JSON data
          break;
        case 'post':
          await axios.post('https://example.com/api', json);
          break;
        default:
          // Handle other elements if needed
          break;
      }
    }

    res.status(200).json({ message: 'File uploaded and operations completed successfully' });
  } catch (error) {
    console.error('Error uploading file and performing operations:', error);
    res.status(500).json({ message: 'Failed to upload file and perform operations' });
  }
}
