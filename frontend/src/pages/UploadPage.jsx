import React, { useState } from 'react';
import './upload.css';

const quickFolders = [
  { name: 'Design', size: '2.5 GB', items: 120 },
  { name: 'Projects', size: '4.2 GB', items: 80 },
  { name: 'Assets', size: '1.1 GB', items: 60 },
  { name: 'Research', size: '3.4 GB', items: 90 },
];

const sampleFiles = [
  {
    name: 'Proposal.docx',
    size: '1.2 MB',
    modified: 'May 10, 2025',
    tags: ['Work'],
    sharedUsers: ['👤', '👩‍💻'],
  },
  {
    name: 'Design.png',
    size: '2.3 MB',
    modified: 'May 8, 2025',
    tags: ['Design', 'Review'],
    sharedUsers: ['🧑‍🎨'],
  },
];

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 shadow-xl">
        <h2 className="text-2xl font-bold text-indigo-600 mb-8">minecloud</h2>
        <ul className="space-y-4">
          <li className="font-semibold text-indigo-600">📁 All Files</li>
          <li>🕒 Recent</li>
          <li>⭐ Favorites</li>
          <li>🔗 Shared</li>
          <li>🏷️ Tags</li>
        </ul>
        <div className="mt-10">
          <p className="text-sm text-gray-600">Storage</p>
          <p className="text-sm">42 GB used of 256 GB</p>
          <progress className="w-full mt-2" value="42" max="256"></progress>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-6">
          <div className="space-x-4">
            <button className="font-medium text-indigo-600 border-b-2 border-indigo-600 pb-1">Files</button>
            <button className="text-gray-500">Activity</button>
            <button className="text-gray-500">Calendar</button>
            <button className="text-gray-500">Contact</button>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search anything..."
              className="border px-4 py-2 rounded-md w-64"
            />
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
          </div>
        </div>

        {/* Quick Access Folders */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {quickFolders.map((folder, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow hover:shadow-md cursor-pointer"
            >
              <div className="text-3xl">📁</div>
              <div className="mt-2">
                <p className="font-semibold">{folder.name}</p>
                <p className="text-sm text-gray-500">
                  {folder.size} • {folder.items} items
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* File Table */}
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
              {sampleFiles.map((file, index) => (
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
        </div>
      </main>

      {/* File Info Panel */}
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
    </div>
  );
}
