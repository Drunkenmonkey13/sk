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

import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UploadPage() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

//   const handleUpload = async () => {
//     const formData = new FormData();
//     formData.append('file', file);

//     const token = localStorage.getItem('access_token');
//     const userId = localStorage.getItem('user_id'); // 👈 get the user id from localStorage
// // alert(token);
// alert(userId);

//     formData.append('uploaded_by', token); // 👈 append user id also
//     alert(formData);

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
const handleUpload = async () => {
    const formData = new FormData();
    formData.append('uploaded_by', 1);
    formData.append('file', file);
  
    const token = localStorage.getItem('access_token');
  
    try {
      await axios.post('http://localhost:8000/api/upload/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/files');
    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      alert('Upload failed');
    }
  };
  

  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default UploadPage;

