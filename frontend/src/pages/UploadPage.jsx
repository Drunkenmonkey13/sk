import React, { useState, useEffect, useRef } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import TablePagination from '@mui/material/TablePagination';
import './upload.css';
import { useNavigate } from 'react-router-dom';
import UserProfilePage from "./UserProfilePage";
import Modal from './Model';
const quickFolders = [
  { name: 'Order Placed', size: '2.5 GB', items: 51 },
  { name: 'In Progress', size: '4.2 GB', items: 0 },
  { name: 'Completed', size: '1.1 GB', items: 0 },
];

export default function UploadPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedFolderIndex, setSelectedFolderIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sampleFiles, setSampleFiles] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchFiles = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch('http://localhost:8000/api/files/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch files');
      const files = await response.json();
      setSampleFiles(files.map(file => ({
        name: file.file,
        size: file.size,
        modified: new Date(file.upload_date).toDateString(),
        tags: [file?.file?.split('.').pop().toLowerCase()],
        sharedUsers: ['📂'],
        status: file.status || 'Order Placed' // defaulting to a status for filter
      })));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async () => {
    if (!fileToUpload) return;

    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('category', 'document'); // or 'image', 'video', 'other'

    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch('http://localhost:8000/api/upload/', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      console.log('Uploaded file:', data);

      setSampleFiles((prev) => [
        ...prev,
        {
          name: data.data.filename,
          size: `${(data.data.file_size / 1024 / 1024).toFixed(2)} MB`,
          modified: new Date(data.data.upload_date).toDateString(),
          type: data.data.file_type,
        },
      ]);

      setFileToUpload(null);
      setShowUploadModal(false);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file.');
    }
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredFiles = sampleFiles.filter(file => file.status === quickFolders[selectedFolderIndex].name);

  const paginatedFiles = filteredFiles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white p-4 shadow-xl">
        <h2 className="text-2xl font-bold text-indigo-600 mb-8">minecloud</h2>
        <ul className="space-y-4">
          <li className="font-semibold text-indigo-600">📁 Dashboard</li>
          <li onClick={() => setShowUploadModal(true)} className="cursor-pointer">📝 Create Project</li>
        </ul>
        <div className="mt-10">
          <p className="text-sm text-gray-600">Storage</p>
          <p className="text-sm">42 GB used of 256 GB</p>
          <progress className="w-full mt-2" value="42" max="256"></progress>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-x-4">
            <button className="font-medium text-indigo-600 border-b-2 border-indigo-600 pb-1">Files</button>
            <button className="text-gray-500">Activity</button>
            <button className="text-gray-500">Calendar</button>
            <button className="text-gray-500">Contact</button>
          </div>
          <div className="flex items-center ">
            <input
              type="text"
              placeholder="Search anything..."
              className="border px-4 py-2 rounded-md w-64"
            />
            <div className="relative inline-block">
              <div
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer select-none mr-2 ml-2"
                title="User menu"
              >
                <span role="img" aria-label="user" className="text-2xl ">👤</span>
              </div>
              {menuOpen && (
                <div
                  ref={menuRef}
                  className="absolute right-0 w-60 bg-white rounded-lg shadow-lg border border-gray-300 z-50"
                >
                  <div className="p-2 space-y-4">
                    <button
                      onClick={() => setIsProfileOpen(true)}
                      className="w-full text-left px-4 py-2 rounded hover:bg-indigo-100 flex items-center gap-3 font-medium">
                      <span className="text-lg">👤</span> Profile
                    </button>

                    <Modal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)}>
                      <UserProfilePage onClose={() => setIsProfileOpen(false)} />
                    </Modal>

                    <button onClick={() => navigate("/setting")} className="w-full text-left px-4 py-2 rounded hover:bg-indigo-100 flex items-center gap-3 font-medium">
                      <span className="text-lg">⚙️</span> Settings
                    </button>
                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/");
                      }}
                      className="w-full text-left px-4 py-2 rounded hover:bg-red-100 text-red-600 flex items-center gap-3 font-medium"
                    >
                      <span className="text-lg">🚪</span> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {quickFolders.map((folder, index) => {
            const isSelected = index === selectedFolderIndex;
            return (
              <div
                key={index}
                onClick={() => setSelectedFolderIndex(index)}
                className={`bg-white p-4 rounded-xl shadow hover:shadow-sm cursor-pointer transition-transform duration-200 ease-in-out 
    ${isSelected ? 'scale-100 border-4 border-gray-400' : selectedFolderIndex !== null ? 'scale-90 border border-transparent' : 'scale-91 border border-transparent'}
  `}
              >
                <div className="text-3xl">📁</div>
                <div className="mt-2">
                  <p className="font-semibold">{folder.name}</p>
                  <p className="text-sm text-gray-500">{folder.items} items</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="text-left px-6 py-3">Name</th>
                <th className="text-left px-6 py-3">Size</th>
                <th className="text-left px-6 py-3">Modified</th>
                <th className="text-left px-6 py-3">Tags</th>
                <th className="text-left px-6 py-3">Shared</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFiles.map((file, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => setSelectedFile(file)}
                >
                  <td className="px-6 py-4 font-medium">📄 {file.name}</td>
                  <td className="px-6 py-4">{file.size}</td>
                  <td className="px-6 py-4">{file.modified}</td>
                  <td className="px-6 py-4 space-x-1">
                    {file.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4 space-x-1">
                    {file.sharedUsers.map((user, i) => (
                      <span key={i}>{user}</span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <TablePagination
            component="div"
            count={filteredFiles.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        </div>
      </main>

      {selectedFile && (
        <aside className="w-80 bg-white p-6 shadow-xl">
          <h3 className="text-xl font-semibold mb-2">{selectedFile.name}</h3>
          <p className="text-gray-500 mb-4">
            {selectedFile.size} • {selectedFile.modified}
          </p>
          <div className="mb-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-1">Tags</h4>
            <div className="space-x-1">
              {selectedFile.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-1">Shared With</h4>
            <div className="flex space-x-2">
              {selectedFile.sharedUsers.map((user, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"
                >
                  {user}
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Upload a File</h2>
            <input type="file" onChange={(e) => setFileToUpload(e.target.files[0])} className="mb-4" />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
