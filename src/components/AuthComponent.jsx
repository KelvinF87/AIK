// src/components/AuthComponent.jsx
import { useState } from 'react';
import axios from 'axios';
const API_URL= import.meta.env.VITE_API_URL
const AuthComponent = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    try {
      const response = await axios.post(API_URL+endpoint, formData);
      onLogin(response.data.token);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl mb-4">{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2"
            />
          </>
        )}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <button onClick={() => setIsRegister(!isRegister)} className="mt-4 text-blue-500">
        {isRegister ? 'Switch to Login' : 'Switch to Register'}
      </button>
    </div>
  );
};

export default AuthComponent;
