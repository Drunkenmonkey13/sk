import axios from 'axios';
import { useEffect, useState } from 'react';

function UserProfilePage({ onClose }) {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    address: ''
  });
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8000/api/profile/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    }).then(response => {
      setProfile(response.data);
    });
  }, []);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setProfile(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));

  //   // Clear the error message as user types
  //   setErrors(prev => ({
  //     ...prev,
  //     [name]: ''
  //   }));
  // };

  // const handleUpdate = async () => {
  //   const newErrors = {};
  //   const requiredFields = ['first_name', 'last_name', 'username', 'email', 'phone', 'address'];

  //   requiredFields.forEach(field => {
  //     if (!profile[field]) {
  //       newErrors[field] = 'This field is required';
  //     }
  //   });

  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     return;
  //   }

  //   const updatedData = { ...profile };
  //   if (password.trim() !== '') {
  //     updatedData.password = password;
  //   }

  //   try {
  //     await axios.put('http://localhost:8000/api/profile/', updatedData, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  //       },
  //     });
  //     alert('Profile Updated');
  //     setPassword('');
  //     if (onClose) onClose();
  //   } catch (error) {
  //     console.error(error);
  //     alert('Failed to update profile');
  //   }
  // };
  const handleUpdate = async () => {
  const newErrors = {};
  const requiredFields = ['first_name', 'last_name', 'username', 'email', 'phone', 'address'];

  requiredFields.forEach(field => {
    if (!profile[field]) {
      newErrors[field] = 'This field is required';
    }
  });

  // Additional phone validation: digits only and 10-digit length (customize as needed)
  if (profile.phone && !/^\d{10}$/.test(profile.phone)) {
    newErrors.phone = 'Enter a valid 10-digit phone number';
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  const updatedData = { ...profile };
  if (password.trim() !== '') {
    updatedData.password = password;
  }

  try {
    await axios.put('http://localhost:8000/api/profile/', updatedData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    alert('Profile Updated');
    setPassword('');
    if (onClose) onClose();
  } catch (error) {
    console.error(error);
    alert('Failed to update profile');
  }
};

const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === 'phone' && /[^0-9]/.test(value)) {
    return; // Ignore non-numeric input
  }

  setProfile(prev => ({
    ...prev,
    [name]: value
  }));

  setErrors(prev => ({
    ...prev,
    [name]: ''
  }));
};

  const inputClass = (field) =>
    `border px-3 py-2 rounded w-full ${errors[field] ? 'border-red-500' : ''}`;

  return (
    <div className="max-w-xl mx-auto mt-6 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>

      {/* First Name & Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">First Name</label>
          <input
            name="first_name"
            value={profile.first_name}
            onChange={handleChange}
            className={inputClass('first_name')}
          />
          {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Last Name</label>
          <input
            name="last_name"
            value={profile.last_name}
            onChange={handleChange}
            className={inputClass('last_name')}
          />
          {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
        </div>
      </div>

      {/* Username & Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            name="username"
            value={profile.username}
            onChange={handleChange}
            className={inputClass('username')}
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Password (optional)</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            placeholder="New password"
          />
        </div>
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Email</label>
        <input
          name="email"
          value={profile.email}
          onChange={handleChange}
          className={inputClass('email')}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      {/* Phone */}
  <div className="mb-4">
  <label className="block mb-1 font-medium">Phone</label>
  <input
    type="tel"
    name="phone"
    value={profile.phone}
    onChange={handleChange}
    className={inputClass('phone')}
    pattern="\d{10}"
    inputMode="numeric"
    maxLength={10}
    placeholder="Enter 10-digit phone number"
  />
  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
</div>



      {/* Address */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Address</label>
        <input
          name="address"
          value={profile.address}
          onChange={handleChange}
          className={inputClass('address')}
        />
        {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
      </div>

      {/* Update Button */}
      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        Update Profile
      </button>
    </div>
  );
}

export default UserProfilePage;
