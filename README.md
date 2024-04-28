# File Upload and Processing App

This is a simple web application for uploading CSV files, processing them, and performing various operations based on user-defined workflows.

## Features

- Upload CSV files.
- Process uploaded files based on selected workflows.
- Convert CSV files to JSON.
- Filter CSV data.
- Post processed data to an API endpoint.
- Support for drag-and-drop file upload.

## Technologies Used

- **Frontend**: React
- **Backend**: Node.js with Express
- **File Upload**: Multer
- **CSV Processing**: csvtojson
- **HTTP Requests**: Axios
- **File System Operations**: fs
- **Cross-Origin Resource Sharing**: CORS

## Setup Instructions

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the backend directory: `cd backend`
3. Install backend dependencies: `npm install`
4. Start the backend server: `npm start`
5. Navigate to the frontend directory: `cd frontend`
6. Install frontend dependencies: `npm install`
7. Start the frontend server: `npm start`
8. Access the application in your web browser at `http://localhost:3000`

## Usage

1. Drag and drop a CSV file or click to select a file.
2. Select a workflow ID from the dropdown menu.
3. Click the "Start Workflow" button to upload the file and initiate processing.
4. Monitor the console logs for progress and any errors.

## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues for any improvements or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
