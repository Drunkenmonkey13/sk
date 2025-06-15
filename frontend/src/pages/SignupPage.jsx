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
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [errors, setErrors] = useState({});

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

   try {
  // Only send the fields expected by your API (not confirmPassword)
    const response = await axios.post('http://localhost:8000/api/signup/', {
      email,
      username,
      password,
      first_name: firstname,
      last_name: lastname,
      phone: phoneNo,
    });

    if (response.data.success) {
      alert(`Signup successful! Your user ID is ${response.data.user_id}`);
      navigate('/');
    } else {
      alert('Signup failed: ' + (response.data.message || 'Unknown error'));
    }
  } catch (error) {
    console.error(error);
    const errMsg = error.response?.data?.message || 'Unknown error';
    const errDetails = JSON.stringify(error.response?.data?.errors || {});
    alert(`Signup failed: ${errMsg}\nDetails: ${errDetails}`);
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

          <label className="block mb-1 font-semibold">First Name</label>
          <input
            placeholder="First Name"
            value={firstname}
            onChange={e => setFirstname(e.target.value)}
            required
          />

          <label className="block mb-1 font-semibold">Last Name</label>
          <input
            placeholder="Last Name"
            value={lastname}
            onChange={e => setLastname(e.target.value)}
            required
          />

          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label className="block mb-1 font-semibold">Username</label>
          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />

          <label className="block mb-1 font-semibold">Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <label className="block mb-1 font-semibold">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />

          <label className="block mb-1 font-semibold">Phone Number</label>
          <input
            type="tel"
            placeholder="Enter Phone Number"
            value={phoneNo}
            onChange={e => setPhoneNo(e.target.value)}
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
