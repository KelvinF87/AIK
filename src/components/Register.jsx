// src/components/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; // Use AuthContext
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const { login } = useAuth();
    const [error, setError] = useState('');
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(API_URL + '/auth/register', {
                username: username,
                password: password,
                name: name,
                email: email,
            });

            if (response.status === 201) {
                const { token, user } = response.data;
                login(token, user);
                navigate('/chat');
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Registration failed. Please check your information.');
        }
    };

    return (
        <div className="flex flex-col items-center p-4 py-15">
            <h2 className="text-2xl mb-4">Register</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded w-full"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded w-full"
                />
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 rounded w-full"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded w-full"
                />
                <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-700 w-full">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;