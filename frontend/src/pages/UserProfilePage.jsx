import axios from 'axios';
import { useEffect, useState } from 'react';
import { useToast } from '../ToastContext';
function UserProfilePage({ onClose }) {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const { showToast } = useToast();

  useEffect(() => {
    axios.get('http://localhost:8000/api/profile/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    }).then(response => {
      setProfile(response.data);
      showToast("user data Fetched",'success')
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only numbers in phone
    if (name === 'phone' && /[^0-9]/.test(value)) return;

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

  const handleUpdate = async () => {
    const requiredFields = ['first_name', 'last_name', 'email', 'phone'];
    const newErrors = {};

    requiredFields.forEach(field => {
      if (!profile[field]) newErrors[field] = 'This field is required';
    });

    if (profile.phone && !/^\d{10}$/.test(profile.phone)) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Send all profile fields except username (and no password)
    const { username, ...dataToSend } = profile;

    try {
      await axios.put('http://localhost:8000/api/profile/', dataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (onClose) onClose();
            showToast("Profile Updated Successfully!..",'success')

    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>

      {/* Name */}
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

      {/* Username */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Username</label>
        <input
          name="username"
          value={profile.username}
          readOnly
          className={inputClass('username')}
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Email</label>
        <input
          name="email"
          type="email"
          value={profile.email}
          onChange={handleChange}
          className={inputClass('email')}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Phone</label>
        <input
          type="tel"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          className={inputClass('phone')}
          maxLength={10}
          placeholder="10-digit phone number"
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onClose}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}

export default UserProfilePage;
