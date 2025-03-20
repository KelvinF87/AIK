import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const History = () => {
    const { token } = useAuth();
    const [history, setHistory] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [messagesPerPage] = useState(5);
    const API_URL = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(false);

    const formatDate = useCallback((dateString) => {
        if (!dateString) {
            return 'N/A';
        }
        try {
            const date = new Date(dateString);
            return format(date, 'yyyy-MM-dd HH:mm:ss');
        } catch (formatError) {
            console.error('Error formatting date:', formatError);
            return 'Invalid Date';
        }
    }, []);

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        try {
            console.log('Fetching chat history from:', `${API_URL}/chat/history`);

            const response = await fetch(`${API_URL}/chat/history`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                // Try to parse JSON error message, but if it fails, use the text.
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage; // Use the error message from JSON if available
                } catch (jsonError) {
                    const errorText = await response.text();
                    errorMessage = errorText || errorMessage; // Use the plain text if JSON parsing fails.
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('Response data:', data);

            if (Array.isArray(data)) {
                setHistory(data);
                setError('');
            } else {
                console.warn('Unexpected data format:', data);
                setError('Unexpected data format from server.');
                setHistory([]);
            }
        } catch (fetchError) {
            console.error('Error fetching chat history:', fetchError);
            setError(`Failed to load chat history: ${fetchError.message}`); //Include message
            setHistory([]);
        } finally {
            setLoading(false);
        }
    }, [API_URL, token]);


    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const indexOfLastChat = currentPage * messagesPerPage;
    const indexOfFirstChat = indexOfLastChat - messagesPerPage;
    const currentChats = history.slice(indexOfFirstChat, indexOfLastChat);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mx-auto p-4 overflow-auto">
            <h2 className="text-2xl font-semibold mb-4">Chat History</h2>

            {loading && <div className="text-center">Loading chat history...</div>}

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {!loading && currentChats.length > 0 ? (
                <div>
                    {currentChats.map((chat) => (
                        <div key={chat.id} className="mb-6 border rounded-md shadow-sm overflow-hidden">
                            <div className="bg-gray-50 p-3 border-b">
                                <h3 className="font-semibold text-gray-700">
                                    Chat ID: {chat.id} - Timestamp: {formatDate(chat.timestamp)}
                                </h3>
                            </div>

                            {chat.messages && Array.isArray(chat.messages) ? (
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
                !loading && <p className="text-gray-500">No chat history available.</p>
            )}

            {history.length > messagesPerPage && Array.isArray(history) && (
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