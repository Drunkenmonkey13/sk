import axios from 'axios';
import { useEffect, useState } from 'react';

function FilesListPage() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/files/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    }).then(response => {
      setFiles(response.data);
    });
  }, []);

  return (
    <div>
      <h2>Files List</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Filename</th>
            <th>Date Uploaded</th>
            <th>File Type</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr key={file.id}>
              <td><a href={`http://localhost:8000/media/${file.file.split('/')[1]}`} target="_blank" rel="noopener noreferrer">{file.filename}</a></td>
              <td>{file.upload_date}</td>
              <td>{file.file_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FilesListPage;
