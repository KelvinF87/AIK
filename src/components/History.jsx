import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const History = () => {
    const { token } = useAuth();
    const [history, setHistory] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [messagesPerPage] = useState(5);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get(`${API_URL}/chat/history`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                setHistory(response.data);
                setError('');
            } catch (error) {
                console.error('Error fetching chat history:', error);
                setError('Failed to load chat history.');
                setHistory([]);
            }
        };

        fetchHistory();
    }, [token, API_URL]);

    const indexOfLastChat = currentPage * messagesPerPage;
    const indexOfFirstChat = indexOfLastChat - messagesPerPage;
    const currentChats = history.slice(indexOfFirstChat, indexOfLastChat);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const formatDate = (dateString) => {
        if (!dateString) {
            return 'N/A';
        }
        try {
            const date = new Date(dateString);
            return format(date, 'yyyy-MM-dd HH:mm:ss'); // Customize the format as needed
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    };

    return (
        <div className="container mx-auto p-4 overflow-auto">
            <h2 className="text-2xl font-semibold mb-4">Chat History</h2>

            {/* Display error message */}
            {error && <div className="text-red-500 mb-4">{error}</div>}

            {/* Display chat history */}
            {currentChats.length > 0 ? (
                <div>
                    {currentChats.map((chat) => (
                        <div key={chat.id} className="mb-6 border rounded-md shadow-sm overflow-hidden">
                            <div className="bg-gray-50 p-3 border-b">
                                <h3 className="font-semibold text-gray-700">
                                    Chat ID: {chat.id} - Timestamp: {formatDate(chat.timestamp)}
                                </h3>
                            </div>

                            {chat.messages && Array.isArray(chat.messages) ? (  // AÑADIDO EL Array.isArray()
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-2 px-4 border-b text-left text-sm font-semibold uppercase tracking-wider text-gray-700">
                                                Role
                                            </th>
                                            <th className="py-2 px-4 border-b text-left text-sm font-semibold uppercase tracking-wider text-gray-700">
                                                Content
                                            </th>
                                            <th className="py-2 px-4 border-b text-left text-sm font-semibold uppercase tracking-wider text-gray-700">
                                                Created At
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {chat.messages.map((message) => (
                                            <tr key={message.id} className="hover:bg-gray-50">
                                                <td className="py-2 px-4 border-b text-sm text-gray-700">
                                                    {message.role === 'user' ? 'You' : 'AI'}
                                                </td>
                                                <td className="py-2 px-4 border-b text-sm text-gray-700">{message.content}</td>
                                                <td className="py-2 px-4 border-b text-sm text-gray-500">{formatDate(message.createdAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="p-3 text-gray-500">No messages in this chat history.</p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No chat history available.</p>
            )}

            {/* Pagination */}
            {history.length > messagesPerPage && (
                <nav className="flex justify-center mt-4">
                    <ul className="flex list-style-none">
                        {Array.from({ length: Math.ceil(history.length / messagesPerPage) }, (_, i) => i + 1).map(
                            (number) => (
                                <li key={number} className="page-item">
                                    <button
                                        onClick={() => paginate(number)}
                                        className={`page-link py-2 px-4 mx-1 rounded ${currentPage === number
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white text-gray-700 hover:bg-blue-200'
                                            } border border-gray-300`}
                                    >
                                        {number}
                                    </button>
                                </li>
                            )
                        )}
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default History;