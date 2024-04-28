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
    console.log(selectedArray);
    if (!file) {
      return res.status(400).json({ message: 'Missing file' });
    }

    const filePath = `tmp/${file.originalname}`;
    const fileContent = fs.readFileSync(file.path);
    await fs.promises.writeFile(filePath, fileContent);

    let success = true;

    // Perform all operations before responding
    for (const element of selectedArray) {
      switch (element) {
        case 'Filter Data':
          const jsonData = await csvtojson().fromFile(filePath);
          const toLowerCaseObject = (obj) => {
            const newObj = {};
            for (const key in obj) {
              if (Object.hasOwnProperty.call(obj, key)) {
                newObj[key.toLowerCase()] = typeof obj[key] === 'string' ? obj[key].toLowerCase() : obj[key];
              }
            }
            return newObj;
          };
          const filteredData = jsonData.map(toLowerCaseObject);
          console.log('Filtered data (lowercase):', filteredData);
          // Perform further operations on the filtered data as needed (optional)
          break;
        case 'Wait':
          await new Promise(resolve => setTimeout(resolve, 60000));
          break;
        case 'Convert':
          const json = await csvtojson().fromFile(filePath).catch(error => {
            console.error('Error converting CSV to JSON:', error);
            throw error;
          });
          if (json) {
            console.log('Converted CSV to JSON:', json);
            // Perform further operations with the JSON data
          }
          break;
        case 'Post':
          if (!json) {
            console.error('JSON data not available to post');
            success = false;
            break;
          }
          try {
            await axios.post('https://example.com/api', json);
          } catch (error) {
            console.error('Error posting JSON data:', error);
            success = false;
          }
          break;
        default:
          // Handle other elements if needed
          break;
      }
    }

    if (success) {
      res.json({ message: 'File uploaded and operations completed successfully' });
    } else {
      res.status(500).json({ message: 'Failed to upload file and perform operations' });
    }
  } catch (error) {
    console.error('Error uploading file and performing operations:', error);
    res.status(500).json({ message: 'Failed to upload file and perform operations' });
  }
});

// Start the Express server
app.listen(3000, () => console.log('Server listening on port 3000'));
