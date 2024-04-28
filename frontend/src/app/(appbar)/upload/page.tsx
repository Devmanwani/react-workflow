"use client"

import React, { useState, useEffect, ChangeEvent, DragEvent } from 'react';

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedId, setSelectedId] = useState<string>('');
  const [workflowIds, setWorkflowIds] = useState<string[]>([]);
  const [workflowData, setWorkflowData] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const storedWorkflows = localStorage.getItem('workflows');
    if (storedWorkflows) {
      const parsedWorkflows: { [key: string]: string[] } = JSON.parse(storedWorkflows);
      setWorkflowIds(Object.keys(parsedWorkflows));
      setWorkflowData(parsedWorkflows);
    }
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    if (!selectedId) {
      alert('Please select a workflow ID.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const selectedArray = workflowData[selectedId];
    if (!selectedArray) {
      console.error('No array found for the selected ID.');
      return;
    }

    formData.append('selectedArray', JSON.stringify(selectedArray));
    

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        alert('Process completed successfully!')
      } else {
        console.error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setFile(null);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('text/')) {
      setFile(droppedFile);
    } else {
      alert('Only text files are allowed.');
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedId(event.target.value);
  };

  return (
    <div className="upload-container flex flex-col items-center justify-center h-screen">
      <label htmlFor="fileInput">
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />
        <div
          className="drag-drop-zone border-dashed border-2 border-gray-400 rounded-md p-8 cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {file ? (
            <p className="text-lg">{file.name}</p>
          ) : (
            <p className="text-lg">Drag & Drop File Here</p>
          )}
        </div>
      </label>
      <select
        value={selectedId}
        onChange={handleSelectChange}
        className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-md"
      >
        <option value="">Select Workflow ID</option>
        {workflowIds.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>
      <button
        onClick={handleFileUpload}
        className="cursor-pointer mt-4 px-6 py-3 bg-blue-500 text-white rounded-md"
        disabled={!file || !selectedId}
      >
        Start WorkFlow
      </button>
    </div>
  );
};

export default Upload;
