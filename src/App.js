import React, { useState } from 'react';
import axios from 'axios';
function App() {
  const [pngFiles, setPngFiles] = useState([]);
  const [quality, setQuality] = useState(80);
  const [outputDirectory, setOutputDirectory] = useState('');
  const [conversionLog, setConversionLog] = useState([]);

  const handleFileUpload = (event) => {
    setPngFiles([...pngFiles, ...event.target.files]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setPngFiles([...pngFiles, ...event.dataTransfer.files]);
  };
  const handleConvert = () => {
    if (!outputDirectory) {
      return alert('Please select an output directory.');
    }

    const formData = new FormData();
    pngFiles.forEach((file) => {
      formData.append('png_files', file);
    });
    formData.append('quality', quality);
    formData.append('output_directory', outputDirectory);

    axios
      .post('/convert', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          setConversionLog([
            ...conversionLog,
            `Uploaded ${Math.round((progressEvent.loaded / progressEvent.total) * 100)}%`,
          ]);
        },
      })
      .then((response) => {
        setConversionLog([...conversionLog, 'Conversion completed successfully.']);
      })
      .catch((error) => {
        setConversionLog([...conversionLog, `Error: ${error.message}`]);
      });
  };
  return (
    <div>
      <h1>Select PNG files to convert to WebP</h1>
      <div onDragOver={handleDragOver} onDrop={handleDrop}>
        <div>
          <label>
            Drop files here
            <input type="file" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
        </div>
        <div>
          <button type="button" onClick={() => document.querySelector('input[type="file"]').click()}>
            Browse for PNG files
          </button>
        </div>
      </div>
      <div>
        <label>
          Quality:
          <input
            type="range"
            min="1"
            max="100"
            value={quality}
            onChange={(event) => setQuality(event.target.value)}
          />
          {quality}%
        </label>
      </div>
      <div>
        <label>
          Output directory:
          <input type="text" value={outputDirectory} onChange={(event) => setOutputDirectory(event.target.value)} />
        </label>
      </div>
      <div>
        <button type="button" onClick={handleConvert}>
          Convert
        </button>
      </div>
      <div>
        <h2>Conversion log</h2>
        <ul>
          {conversionLog.map((logItem, index) => (
            <li key={index}>{logItem}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
