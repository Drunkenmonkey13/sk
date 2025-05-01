import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Reuse same styles

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/signup/', {
        email,
        username,
        password,
        confirmPassword, // If your backend expects `password2`, change this
      });

      localStorage.setItem('access_token', response.data.access);
      alert("Signup successful");
      navigate('/upload');
    } catch (error) {
      console.error(error);
      alert('Signup failed: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <h1>Join Us!</h1>
        <p>Create your account to start uploading and managing your files today.</p>
      </div>
      <div className="right-panel">
        <form onSubmit={handleSignup} className="login-form">
          <h2>Sign Up</h2>
          <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Create Account</button>
          <p>
            Already have an account?{' '}
            <span className="link" onClick={() => navigate('/')}>
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
