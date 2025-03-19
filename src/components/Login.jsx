import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();  // Access the login function from the context
    const [error, setError] = useState(''); // State for error messages
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors

        try {
            const response = await axios.post(API_URL + '/auth/login', {
                username: username,
                password: password,
            });

            if (response.status === 200) {
                // Successful login
                const { token, user } = response.data; // Assuming the response includes a user object
                login(token, user);  // Call the login function from the context with token and user data
                navigate('/chat'); // Redirect to the chat page after successful login
                // console.log(token)
            } else {
                setError('Invalid username or password.');
            }
        } catch (err) {
            console.error('Login failed:', err);
            setError('Invalid username or password.'); //Generic error message
        }
    };

    return (
        <div className="flex flex-col items-center p-4 py-15">
            <h2 className="text-2xl mb-4">Login</h2>
            {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 w-full">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;