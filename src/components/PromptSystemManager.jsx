import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const PromptSystemManager = () => {
    const { token } = useAuth();
    const [prompts, setPrompts] = useState([]);
    const [selectedPrompt, setSelectedPrompt] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchPrompts();
    }, [token, API_URL]);

    const fetchPrompts = async () => {
        try {
            const response = await axios.get(`${API_URL}/prompt-system`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPrompts(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching prompt systems:', error);
            setError('Failed to load prompt systems.');
            setPrompts([]);
        }
    };

    const handleUpdatePrompt = async (id, data) => {
        try {
            const response = await axios.put(`${API_URL}/prompt-system/${id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage(response.data.message);
            setError('');
            fetchPrompts(); // Refresh prompts after update
        } catch (error) {
            console.error('Error updating prompt system:', error);
            setError('Failed to update prompt system.');
            setMessage('');
        }
    };

    const handleDeletePrompt = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/prompt-system/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage(response.data.message);
            setError('');
            fetchPrompts(); // Refresh prompts after delete
        } catch (error) {
            console.error('Error deleting prompt system:', error);
            setError('Failed to delete prompt system.');
            setMessage('');
        }
    };

    return (
        <div className="bg-gray-500 shadow-md rounded-lg p-4 mb-6 overflow-x-auto">
            <h3 className="text-lg font-medium mb-2">Manage Prompt Systems</h3>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            {message && <div className="text-green-500 mb-2">{message}</div>}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-2 px-4 border-b text-left text-sm font-semibold uppercase tracking-wider text-gray-700">
                                Name
                            </th>
                            <th className="py-2 px-4 border-b text-left text-sm font-semibold uppercase tracking-wider text-gray-700">
                                Description
                            </th>
                            <th className="py-2 px-4 border-b text-left text-sm font-semibold uppercase tracking-wider text-gray-700">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {prompts.map((prompt) => (
                            <tr key={prompt.id} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b text-sm text-gray-700">{prompt.name}</td>
                                <td className="py-2 px-4 border-b text-sm text-gray-700">{prompt.description}</td>
                                <td className="py-2 px-4 border-b text-sm text-gray-700">
                                    <button
                                        onClick={() => setSelectedPrompt(prompt)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeletePrompt(prompt.id)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PromptSystemManager;