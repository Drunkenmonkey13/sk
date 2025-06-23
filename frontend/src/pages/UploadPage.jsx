import React, { useState, useEffect, useRef } from 'react';
import TablePagination from '@mui/material/TablePagination';
import './upload.css';
import { useNavigate } from 'react-router-dom';
import UserProfilePage from "./UserProfilePage";
import Modal from './Model';
import { useToast } from '../ToastContext';

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
  const [count, setCount] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [editableName, setEditableName] = useState('');
  const [profile, setProfile] = useState({});
  const [password, setPassword] = useState('');
  const { showToast } = useToast();

  const quickFolders = [
  { name: 'Order Placed', size: '2.5 GB', items: count },
  { name: 'In Progress', size: '4.2 GB', items: 0 },
  { name: 'Completed', size: '1.1 GB', items: 0 },
];

  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    // Closes dropdown if user clicks outside
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [editModalOpen, setEditModalOpen] = useState(false);
  // ✅ Fetch and map files from the backend API
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

      const mappedFiles = files.map(file => ({
        id: file.id,
        name: file.file.split('/').pop(),
        type: file.file_type || 'unknown',
        uploadedDate: new Date(file.upload_date),
        size: formatBytes(file.file_size),
        status: file.status || 'Order Placed',
        file: file.file,
        filename: file.filename,
      }));

      localStorage.setItem('sampleFiles', JSON.stringify(files));
      setSampleFiles(mappedFiles);
      setCount(mappedFiles.length);

      if (mappedFiles.length === 0) {
        showToast("No Files Found!...", "warning");
      }

    } catch (error) {
      showToast("Something Went Wrong!...", "error");
      console.error(error);
    }
  };

  // ✅ Upload file via FormData to backend
  const handleUpload = async () => {
    if (!fileToUpload) return;

    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('category', 'document');

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
      fetchFiles();
      // setSampleFiles((prev) => [
      //   ...prev,
      //   {
      //     id:data.data.id,
      //     name: data.data.filename,
      //     size: formatBytes(data.data.file_size),
      //     uploadedDate: new Date(data.data.upload_date).toLocaleString(),
      //     type: data.data.file_type,
      //     status: data.data?.status || 'Order Placed'
      //   },
      // ]);
      setFileToUpload(null);
      setShowUploadModal(false);
      showToast("File uploaded Sucessfully!...", "success");

    } catch (error) {
      console.error('Upload error:', error);
      showToast("Failed to upload file.","error");
    }
  };

  // ✅ Format file size (bytes) into readable string
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  };

  // ✅ Pagination: Change current page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // ✅ Pagination: Change rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ✅ Filter files by name/type/date (search term)
  const filteredFiles = sampleFiles.filter(file => {
    const lowerSearch = searchTerm.toLowerCase();
    const nameMatch = file.name.toLowerCase().includes(lowerSearch);
    const typeMatch = file.type.toLowerCase().includes(lowerSearch);
    const dateStr = new Date(file.uploadedDate).toLocaleString().toLowerCase();
    const dateMatch = dateStr.includes(lowerSearch);

    return nameMatch || typeMatch || dateMatch;
  });

  // ✅ Slice filtered files for current page
  const paginatedFiles = filteredFiles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // ✅ Open edit modal for a file
  const [selectededitFile, setSelectededitFile] = useState(null);
  const handleEdit = (file) => {
    setSelectededitFile(file);
    setEditableName(getNameWithoutExtension(file.name));
    setEditModalOpen(true);
  };

  // ✅ Open delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const handleDelete = (file) => {
    setFileToDelete(file);
    setShowDeleteModal(true);
  };

  // ✅ Delete file from backend and update list
  const onFileDelete = async (id) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`http://localhost:8000/api/files/${id}/delete/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete file');
      fetchFiles();
      showToast("File Deleted Sucessfully!...", "success");

    } catch (error) {
      showToast("Something went Wrong!...", "error");
      console.error(error);
    }
  };

  // ✅ Rename file if the name is different
  const handleUpdateFile = async () => {
    try {
      const files = JSON.parse(localStorage.getItem('sampleFiles') || '[]');
      const absoluteFileUrl = files?.filter(x => x.id === selectededitFile.id)[0];

      const newFullName = `${editableName}.${selectededitFile.type}`;
      if (!absoluteFileUrl || absoluteFileUrl.filename.toLowerCase() === newFullName.toLowerCase()) {
        showToast("No changes Found!...", "warning");
        return;
      }

      const response = await fetch(`http://localhost:8000/api/rename-file/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          file_url: absoluteFileUrl.file.substring(absoluteFileUrl.file.indexOf("/media")),
          new_name: editableName
        })
      });

      const data = await response.json();
      if (!response.ok) {
        showToast(response.message, "error");
        throw new Error(data.error || 'Rename failed');
      }

      showToast(data.message, "success");
      fetchFiles();
      setEditModalOpen(false);

    } catch (error) {
      console.error(error);
      showToast("Something went wrong!...", "error");
    }
  };

  // ✅ Fetch user profile and open modal
  const handleProfileOpen = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('http://localhost:8000/api/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await res.json();
      setProfile({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        username: data.username || '',
        email: data.email || '',
        phone: data.phone_number || '',
        password: data.password || ''
      });
      setIsProfileOpen(true);

    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  // ✅ Utility to remove file extension
  const getNameWithoutExtension = (filename) => {
    return filename.replace(/\.[^/.]+$/, '');
  };

  return (

    <><div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white p-4 shadow-xl">
        <div className="text-center mb-8">
          <img src="/images/lioncircuits_logo.jpg" alt="Lion Circuits Logo" className="w-20 h-20 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-orange-400">Lion Circuits</h2>
        </div>
        <ul className="space-y-4">
          <li className="font-semibold text-indigo-600">📁 Dashboard</li>
          <li onClick={() => setShowUploadModal(true)} className="cursor-pointer">📝 Create Project</li>
        </ul>
      </aside>
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-x-4">
          </div>
          <div className="flex items-center ">
            <input
              type="text"
              placeholder="Search anything..."
              className="border px-4 py-2 rounded-md w-64 mb-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />
            <div className="relative inline-block">
              <div
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer select-none mr-2 ml-2 mb-[16px]"
                title="User menu">
                <span role="img" aria-label="user" className="text-2xl ">👤</span>
              </div>
              {menuOpen && (
                <div
                  ref={menuRef}
                  className="absolute right-0 w-60 bg-white rounded-lg shadow-lg border border-gray-300 z-50">
                  <div className="p-2 ">
                    <button
                      onClick={() => handleProfileOpen()}
                      className="w-full text-left px-4 py-2 rounded hover:bg-indigo-100 flex items-center gap-3 font-medium">
                      <span className="text-lg">👤</span> Profile
                    </button>

                    <Modal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)}>
                      <UserProfilePage
                        profile={profile}
                        setProfile={setProfile}
                        password={password}
                        setPassword={setPassword}
                        onClose={() => setIsProfileOpen(false)} />
                    </Modal>
                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/");
                      }}
                      className="w-full text-left px-4 py-2 rounded hover:bg-red-100 text-red-600 flex items-center gap-3 font-medium">
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
                  ${isSelected ? 'scale-100 border-4 border-gray-400' : selectedFolderIndex !== null ? 'scale-90 border border-transparent' : 'scale-91 border border-transparent'}`}>
                <div className="text-3xl">📁</div>
                <div className="mt-2">
                  <p className="font-semibold">{folder.name}</p>
                  <p className="text-sm text-gray-500">{folder.items} items</p>
                </div>
              </div>
            );
          })}
        </div>
        <br />
        <div className="bg-white rounded-xl shadow overflow-hidden mb-[100px]">
          <table className="min-w-full">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="text-left px-6 py-3">Name</th>
                <th className="text-left px-6 py-3">Size</th>
                <th className="text-left px-6 py-3">Uploaded Date</th>
                <th className="text-left px-6 py-3">Type</th>
                <th className="text-left px-6 py-3">Actions</th> {/* New Actions column */}
              </tr>
            </thead>
            <tbody>
              {paginatedFiles.map((file, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => setSelectedFile(file)}>
                  <td className="px-6 py-4 font-medium">📄 {file.name}</td>
                  <td className="px-6 py-4">{file.size}</td>
                  <td className="px-6 py-4">{new Date(file.uploadedDate).toLocaleString()}</td>
                  <td className="px-6 py-4 space-x-1">{file.type}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(file);
                      }}
                      className="bg-white-500 hover:bg-gray-600 text-white px-3 py-1 text-xs rounded">
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file);
                      }}
                      className="bg-white-500 hover:bg-gray-600 text-white px-3 py-1 text-xs rounded">
                      🗑️
                    </button>
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
            rowsPerPageOptions={[10, 25, 50, 100]} />
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Delete Confirmation</h2>
                <p className="mb-6">
                  Are you sure you want to delete <strong>{fileToDelete?.name}</strong>?
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      console.log("Deleted file:", fileToDelete);
                      onFileDelete(fileToDelete.id);
                      setShowDeleteModal(false);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
          {editModalOpen && selectededitFile && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Edit File</h2>
                <label className="block mb-2">File Name</label>
                <input
                  type="text"
                  className="border px-4 py-2 w-full mb-4 rounded"
                  value={editableName}
                  onChange={(e) => setEditableName(e.target.value)} />
                <label className="block mb-2">File Type</label>
                <input
                  type="text"
                  className="border px-4 py-2 w-full mb-4 rounded"
                  value={selectededitFile.type}
                  readOnly />
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateFile()}
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      {selectedFile && (
        <aside className="relative w-80 bg-white p-6 shadow-xl">
          <button
            onClick={() => setSelectedFile(null)}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg font-bold"
            aria-label="Close">
            ×
          </button>
          <h3 className="text-xl font-semibold mb-2">{selectedFile.name}</h3>
          <p className="text-gray-500 mb-4">
            {selectedFile.size}
            {selectedFile.uploadedDate && (
              <> • {new Date(selectedFile.uploadedDate).toLocaleString()}</>
            )}
          </p>
          {selectedFile.status && (
            <p className="text-sm text-blue-600 mb-4">Status: {selectedFile.status}</p>
          )}
          {selectedFile.tags?.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-sm text-gray-700 mb-1">Tags</h4>
              <div className="space-x-1">
                {selectedFile.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          {selectedFile.sharedUsers?.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-1">Shared With</h4>
              <div className="flex space-x-2">
                {selectedFile.sharedUsers.map((user, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm">
                    {user}
                  </div>
                ))}
              </div>
            </div>
          )}
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
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div></>
  );
}
