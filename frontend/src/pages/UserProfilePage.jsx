import axios from 'axios';
import { useEffect, useState } from 'react';

function UserProfilePage() {
  const [profile, setProfile] = useState({ username: '', email: '' });
  const [username, setUsername] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/profile/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    }).then(response => {
      setProfile(response.data);
      setUsername(response.data.username);
    });
  }, []);

  const handleUpdate = async () => {
    await axios.put('http://localhost:8000/api/profile/', { username }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    });
    alert('Profile Updated');
  };

  return (
    <div>
      <h2>User Profile</h2>
      <p>Email: {profile.email}</p>
      <input value={username} onChange={e => setUsername(e.target.value)} />
      <button onClick={handleUpdate}>Update Username</button>
    </div>
  );
}

export default UserProfilePage;
