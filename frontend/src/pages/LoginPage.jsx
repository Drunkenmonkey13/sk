
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Make sure this file exists
import { useToast } from '../ToastContext';
function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
const { showToast } = useToast();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        email,
        password,
      });
      localStorage.setItem('access_token', response.data.access);
      showToast('Logged in Successfully!..', 'success')
      navigate('/upload');
    } catch (error) {
       showToast('something went !..', 'error')
      alert('Login failed');
    }
  };

  return (
    
    <div className="login-container">
      <div className="left-panel">
        <h1>Welcome Back!</h1>
        <p>Log in to access your account and manage your files.</p>
      </div>
      <div className="right-panel">      
        <form onSubmit={handleLogin} className="login-form">
          <h2 className="text-2xl font-semibold mb-4">Login</h2>

          <label htmlFor="email" className="block mb-1 font-semibold">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-4 px-3 py-2 border rounded w-full"
          />

          <label htmlFor="password" className="blok mb-1 font-semibold">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-4 px-3 py-2 border rounded w-full"
          />

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
            Login
          </button>

          <p className="mt-4">
            Don’t have an account?{' '}
            <span className="text-blue-600 cursor-pointer underline" onClick={() => navigate('/signup')}>
              Sign Up
            </span>
          </p>
        </form>

      </div>
    </div>
  );
}

export default LoginPage;
