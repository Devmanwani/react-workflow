const express = require('express');
const multer = require('multer');
const csvtojson = require('csvtojson');
const axios = require('axios');
const fs = require('fs'); // No promises needed here
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for temporary storage
const upload = multer({ dest: 'tmp/' }); // Replace with your desired location

// Route handler for POST requests
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const selectedArray = JSON.parse(req.body.selectedArray);

    if (!file) {
      return res.status(400).json({ message: 'Missing file' });
    }

    console.log('File object:', file);
console.log('File buffer:', file.buffer);

   
   
const filePath = `tmp/${file.originalname}`;

// Read the file content from the temporary path
const fileContent = fs.readFileSync(file.path);

// Write the file content to the desired location
await fs.promises.writeFile(filePath, fileContent);
    for (const element of selectedArray) {
      switch (element) {
        case 'filter data':
          // Access the uploaded CSV data (converted to JSON)
          const jsonData = await csvtojson().fromFile(filePath);

          // Function to convert all column values in an object to lowercase
          const toLowerCaseObject = (obj) => {
            const newObj = {};
            for (const key in obj) {
              if (Object.hasOwnProperty.call(obj, key)) {
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
          // Ensure csvtojson Promise is resolved properly
          const json = await csvtojson().fromFile(filePath).catch(error => {
            console.error('Error converting CSV to JSON:', error);
            throw error;
          });
          if (json) {
            console.log('Converted CSV to JSON:', json);
            // Perform further operations with the JSON data
          }
          break;
        case 'post':
          // Ensure json is defined before using
          if (json) {
            await axios.post('https://example.com/api', json);
          } else {
            console.error('JSON data not available to post');
          }
          break;
        default:
          // Handle other elements if needed
          break;
      }
    }

    res.json({ message: 'File uploaded and operations completed successfully' });
  } catch (error) {
    console.error('Error uploading file and performing operations:', error);
    res.status(500).json({ message: 'Failed to upload file and perform operations' });
  }
});

// Start the Express server
app.listen(3000, () => console.log('Server listening on port 3000'));
