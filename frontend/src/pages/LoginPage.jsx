// import axios from 'axios';
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function LoginPage() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:8000/api/login/', {
//         email,
//         password,
//       });
//       localStorage.setItem('access_token', response.data.access);
//       alert(response.data.access)
//       navigate('/upload');
//     } catch (error) {
//       alert('Login failed');
//     }
//   };



  
//  return (
//     <>
//     <form onSubmit={handleLogin}>
//       <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
//       <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
//       <button type="submit">Login</button>
     

//     </form>
//     <button type="button" onClick={() => navigate('/signup')}>
//       Sign Up
//     </button>
// </>

    
//   );
// }

// export default LoginPage;
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Make sure this file exists

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        email,
        password,
      });
      localStorage.setItem('access_token', response.data.access);
      navigate('/upload');
    } catch (error) {
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
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          <p>
            Don’t have an account?{' '}
            <span className="link" onClick={() => navigate('/signup')}>
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
