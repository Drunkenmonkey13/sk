// import axios from 'axios';
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function UploadPage() {
//   const [file, setFile] = useState(null);
//   const navigate = useNavigate();

//   const handleUpload = async () => {
//     if (!file) {
//       alert('Please select a file first!');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);

//     // 🔥 Add userId
//     const userId = localStorage.getItem('user_id'); // Make sure you store user_id when logging in
//     formData.append('uploaded_by', userId); // 👈 important addition

//     try {
//       await axios.post('http://localhost:8000/api/upload/', formData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       navigate('/files');
//     } catch (error) {
//       console.error('Upload failed:', error.response?.data || error.message);
//       alert('Upload failed');
//     }
//   };

//   return (
//     <div>
//       <h2>Upload a File</h2>
//       <input type="file" onChange={e => setFile(e.target.files[0])} />
//       <button onClick={handleUpload}>Upload</button>
//     </div>
//   );
// }

// export default UploadPage;

// import axios from 'axios';
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function UploadPage() {
//   const [file, setFile] = useState(null);
//   const navigate = useNavigate();


// const handleUpload = async () => {
//     const formData = new FormData();
//     formData.append('uploaded_by', 1);
//     formData.append('file', file);
  
//     const token = localStorage.getItem('access_token');
  
//     try {
//       await axios.post('http://localhost:8000/api/upload/', formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       navigate('/files');
//     } catch (error) {
//       console.error('Upload failed:', error.response?.data || error.message);
//       alert('Upload failed');
//     }
//   };
  

//   return (
//     <div>
//       <input type="file" onChange={e => setFile(e.target.files[0])} />
//       <button onClick={handleUpload}>Upload</button>
//     </div>
//   );
// }

// // export default UploadPage;
// import  axios from 'axios';
// import { useState,useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './UploadPage.css'; // Assuming you already have your styles in this file.

// function UploadPage() {
//   const [file, setFile] = useState(null);
//   const [time, setTime] = useState(new Date());
//   const [files, setFiles] = useState([]);
//   const navigate = useNavigate();

//   // Update time every second
//   useEffect(() => {
//     const interval = setInterval(() => setTime(new Date()), 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const [getfiles, setgetFiles] = useState([]);

//   useEffect(() => {
//     axios.get('http://localhost:8000/api/files/', {
//       headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
//     }).then(response => {
//       setgetFiles(response.data);
//     });
//   }, []);
  
//   const handleFileChange = (e) => {
//     const newFile = e.target.files[0];
//     if (newFile) {
//       setFiles([{ name: newFile.name, progress: 0 }]);
//       setFile(newFile);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert("Please select a file to upload.");
//       return;
//     }
  
//     const formData = new FormData();
//     formData.append('uploaded_by', 1); // You can adjust this based on your data
//     formData.append('file', file);
  
//     const token = localStorage.getItem('access_token');
    
//     // Simulating file upload progress
//     const updateProgress = (progress) => {
//       setFiles([{ name: file.name, progress }]);
//     };
  
//     try {
//       // Simulating upload progress from 0 to 100
//       for (let progress = 0; progress <= 100; progress++) {
//         updateProgress(progress);
//         await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay (e.g., slow upload)
//       }
  
//       // Actual file upload
//       await axios.post('http://localhost:8000/api/upload/', formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
  
//       // Navigate to files page after successful upload
//       navigate('/files');
//     } catch (error) {
//       console.error('Upload failed:', error.response?.data || error.message);
//       alert('Upload failed');
//     }
//   };
  

//   return (
//     <div className="upload-dashboard">
//       {/* Header */}
//       <div className="header">
//         <div className="left">Upload Dashboard</div>
//         <div className="right">
//           <span>{time.toLocaleTimeString()}</span>
//           <img
//             src="https://www.svgrepo.com/show/485365/user-circle.svg"
//             alt="profile"
//             className="profile-icon"
//           />
//         </div>
//       </div>

//       {/* Body */}
//       <div className="body">
//         <div className="upload-area">
//           <div className="dropzone">
//             <p>Drag & drop or <span className="browse">browse</span> files to upload!</p>
//             <input type="file" onChange={handleFileChange} />
//           </div>
//           <div className="file-list">
//             {files.map((file, index) => (
//               <div key={index} className="file-item">
//                 <span>{file.name}</span>
//                 <div className="progress-bar">
//                   <div
//                     className="fill"
//                     style={{ width: `${file.progress}%`, backgroundColor: file.progress === 100 ? '#4caf50' : '#2196f3' }}
//                   ></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <button onClick={handleUpload}>Upload</button>
//         </div>

//         <div className="sidebar">
//           <h4>File Stats</h4>
//           <p>Total Files: {files.length}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// // export default UploadPage;
// import axios from 'axios';
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
// import './UploadPage.css';

// // Register chart components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// function UploadPage() {
//   const [file, setFile] = useState(null);
//   const [time, setTime] = useState(new Date());
//   const [files, setFiles] = useState([]);
//   const [getfiles, setgetFiles] = useState([]);
//   const navigate = useNavigate();

//   // Update time every second
//   useEffect(() => {
//     const interval = setInterval(() => setTime(new Date()), 1000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     axios.get('http://localhost:8000/api/files/', {
//       headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
//     }).then(response => {
//       setgetFiles(response.data);
//     });
//   }, []);
  
//   const handleFileChange = (e) => {
//     const newFile = e.target.files[0];
//     if (newFile) {
//       setFiles([{ name: newFile.name, progress: 0 }]);
//       setFile(newFile);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert("Please select a file to upload.");
//       return;
//     }
  
//     const formData = new FormData();
//     formData.append('uploaded_by', 1);
//     formData.append('file', file);
  
//     const token = localStorage.getItem('access_token');
    
//     // Simulating file upload progress
//     const updateProgress = (progress) => {
//       setFiles([{ name: file.name, progress }]);
//     };
  
//     try {
//       // Simulating upload progress from 0 to 100
//       for (let progress = 0; progress <= 100; progress++) {
//         updateProgress(progress);
//         await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay
//       }
  
//       // Actual file upload
//       await axios.post('http://localhost:8000/api/upload/', formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
  
//       // Navigate to files page after successful upload
//       // navigate('/files');
//     } catch (error) {
//       console.error('Upload failed:', error.response?.data || error.message);
//       alert('Upload failed');
//     }
//   };

//   // Prepare data for the bar chart (you can adjust based on the data you want to visualize)
//   const chartData = {
//     labels: getfiles.map(file => file.filename),
//     datasets: [
//       {
//         label: 'File Upload Progress',
//         data: getfiles.map(file => Math.floor(Math.random() * 100)), // Simulated data
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <div className="upload-dashboard">
//       {/* Header */}
//       <div className="header">
//         <div className="left">Upload Dashboard</div>
//         <div className="right">
//           <span>{time.toLocaleTimeString()}</span>
//           <img
//             src="https://www.svgrepo.com/show/485365/user-circle.svg"
//             alt="profile"
//             className="profile-icon"
//           />
//         </div>
//       </div>

//       {/* Body */}
//       <div className="body">
//         <div className="upload-area">
//           <div className="dropzone">
//             <p>Drag & drop or <span className="browse">browse</span> files to upload!</p>
//             <input type="file" onChange={handleFileChange} />
//           </div>
//           <div className="file-list">
//             {files.map((file, index) => (
//               <div key={index} className="file-item">
//                 <span>{file.name}</span>
//                 <div className="progress-bar">
//                   <div
//                     className="fill"
//                     style={{ width: `${file.progress}%`, backgroundColor: file.progress === 100 ? '#4caf50' : '#2196f3' }}
//                   ></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <button onClick={handleUpload}>Upload</button>
//         </div>

//         <div className="sidebar">
//           {/* File Stats Table */}
//           <h4>File Stats</h4>
//           <table border="1">
//             <thead>
//               <tr>
//                 <th>Filename</th>
//                 <th>Date Uploaded</th>
//                 <th>File Type</th>
//               </tr>
//             </thead>
//             <tbody>
//               {getfiles.map(file => (
//                 <tr key={file.id}>
//                   <td><a href={`http://localhost:8000/media/${file.file.split('/')[1]}`} target="_blank" rel="noopener noreferrer">{file.filename}</a></td>
//                   <td>{file.upload_date}</td>
//                   <td>{file.file_type}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Bar Chart */}
//           <div className="chart-container" style={{ marginTop: '20px' }}>
//             <Bar data={chartData} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default UploadPage;

import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import './UploadPage.css';
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import TablePagination from '@mui/material/TablePagination';


// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function UploadPage() {
  const [file, setFile] = useState(null);
  const [time, setTime] = useState(new Date());
  const [files, setFiles] = useState([]);
  const [getfiles, setgetFiles] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Or any default value
  
  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch files from the API
  useEffect(() => {
    axios.get('http://localhost:8000/api/files/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    }).then(response => {
      setgetFiles(response.data);
    });
  }, []);
  
  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      setFiles([{ name: newFile.name, progress: 0 }]);
      setFile(newFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
  
    const formData = new FormData();
    formData.append('uploaded_by', 1);
    formData.append('file', file);
  
    const token = localStorage.getItem('access_token');
    
    // Simulating file upload progress
    const updateProgress = (progress) => {
      setFiles([{ name: file.name, progress }]);
    };
  
    try {
      // Simulating upload progress from 0 to 100
      for (let progress = 0; progress <= 100; progress++) {
        updateProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay
      }
  
      // Actual file upload
      await axios.post('http://localhost:8000/api/upload/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Fetch files again after successful upload
      axios.get('http://localhost:8000/api/files/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      }).then(response => {
        // setgetFiles(response.data);
        alert(response.data.file)
        setgetFiles(response.data.sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date)));

      });

      // Navigate to files page after successful upload
      // navigate('/files');
    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      alert('Upload failed');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const paginatedFiles = getfiles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Prepare data for the bar chart (you can adjust based on the data you want to visualize)
  const chartData = {
    labels: getfiles.map(file => file.filename),
    datasets: [
      {
        label: 'File Upload Progress',
        data: getfiles.map(file => Math.floor(Math.random() * 100)), // Simulated data
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="upload-dashboard">
      {/* Header */}
      <div className="header">
        <div className="left">Upload Dashboard</div>
        <div className="right">
          <span>{time.toLocaleTimeString()}</span>
          <img
            src="https://www.svgrepo.com/show/485365/user-circle.svg"
            alt="profile"
            className="profile-icon"
          />
        </div>
      </div>

      {/* Body */}
      <div className="body">
        <div className="upload-area">
          <div className="dropzone">
            <p>Drag & drop or <span className="browse">browse</span> files to upload!</p>
            <input type="file" onChange={handleFileChange} />
          </div>
          <div className="file-list">
            {files.map((file, index) => (
              <div key={index} className="file-item">
                <span>{file.name}</span>
                <div className="progress-bar">
                  <div
                    className="fill"
                    style={{ width: `${file.progress}%`, backgroundColor: file.progress === 100 ? '#4caf50' : '#2196f3' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleUpload}>Upload</button>
        </div>

        <div className="sidebar">
          {/* File Stats Table */}
          <h4>File Stats</h4>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Filename</TableCell>
                  <TableCell>Date Uploaded</TableCell>
                  <TableCell>File Type</TableCell>
                  <TableCell>Download</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
              {paginatedFiles.map(file => (
                  <TableRow key={file.id}>
                    <TableCell>{file.file.split('/').pop()}</TableCell>

                    {/* <TableCell>
                      <a href={`http://localhost:8000/media/${file.file.split('/')[1]}`} target="_blank" rel="noopener noreferrer">{file.filename}</a>
                    </TableCell> */}
                    <TableCell>{new Date(file.upload_date).toLocaleString(undefined, {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}</TableCell>
                    {/* <TableCell>{file.file_type}</TableCell> */}
                    <TableCell>{file.file.split('.').pop()}</TableCell>
                <TableCell>
  <IconButton
    component="a"
    href={file.file}
    download
    target="_blank"
    rel="noopener noreferrer"
  >
    <DownloadIcon />
  </IconButton>
</TableCell> 

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
  component="div"
  count={getfiles.length}
  page={page}
  onPageChange={handleChangePage}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={handleChangeRowsPerPage}
  rowsPerPageOptions={[5, 10, 25]}
/>

          {/* Bar Chart */}
          {/* <div className="chart-container" style={{ marginTop: '20px' }}>
            <Bar data={chartData} />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
