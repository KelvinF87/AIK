import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import PromptSystemManager from './PromptSystemManager';

const Admin = () => {
    const { token, user } = useAuth();
    const [promptSystem, setPromptSystem] = useState({
        name: '',
        description: '',
        content: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [configuration, setConfiguration] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (user && user.role !== 'admin') {
            setMessage('You do not have permission to access this page.');
            setError('');
        } else {
            setMessage('');
            setError('');
            fetchConfiguration();
        }
    }, [user]);

    const handleChange = (e) => {
        setPromptSystem({ ...promptSystem, [e.target.name]: e.target.value });
    };

    const handleCreatePrompt = async () => {
        try {
            const response = await axios.post(API_URL + '/prompt-system', promptSystem, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                setMessage('Prompt system created successfully!');
                setError('');
                setPromptSystem({ name: '', description: '', content: '' });
            } else {
                setMessage('Failed to create prompt system.');
                setError('Failed to create prompt system.');
            }
        } catch (error) {
            console.error('Error creating prompt system:', error);
            setMessage('Error creating prompt system.');
            setError('Error creating prompt system.');
        }
    };

    const fetchConfiguration = async () => {
        try {
            const response = await axios.get(`${API_URL}/configuration`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setConfiguration(response.data);
        } catch (error) {
            console.error('Error fetching configuration:', error);
            setError('Failed to load configuration.');
        }
    };

    if (user && user.role !== 'admin') {
        return (
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-semibold mb-4">Admin</h2>
                {message && <p className="text-red-500">{message}</p>}
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Admin - Prompt System</h2>

            {/* Configuration Table */}
            {configuration && (
                <div className="shadow-md overflow-auto my-6">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-2 px-4 border-b text-left text-sm font-semibold uppercase tracking-wider text-gray-700">
                                    Field
                                </th>
                                <th className="py-2 px-4 border-b text-left text-sm font-semibold uppercase tracking-wider text-gray-700">
                                    Value
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(configuration).map(([key, value]) => (
                                <tr key={key} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b text-sm text-gray-700">{key}</td>
                                    <td className="py-2 px-4 border-b text-sm text-gray-700">{JSON.stringify(value)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Feedback messages */}
            {message && <p className="mb-4 text-green-500">{message}</p>}
            {error && <p className="mb-4 text-red-500">{error}</p>}

            {/* Prompt System form */}
            <div className="bg-gray-600 shadow-md rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium mb-2">Create Prompt System</h3>
                <div className="space-y-2">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={promptSystem.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={promptSystem.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                        name="content"
                        placeholder="Content"
                        value={promptSystem.content}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button onClick={handleCreatePrompt} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Create Prompt System
                    </button>
                </div>
            </div>

            {/* Prompt System Management */}
            <PromptSystemManager />
        </div>
    );
};

export default Admin;