import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UploadPage from './pages/UploadPage';
import FilesListPage from './pages/FilesListPage';
import PortalDetailsPage from './pages/PortalDetailsPage';
import UserProfilePage from './pages/UserProfilePage';
import SignupPage from './pages/SignupPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/files" element={<FilesListPage />} />
        <Route path="/portal-details" element={<PortalDetailsPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
