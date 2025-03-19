import  { useEffect, useState } from 'react';
import axios from 'axios';
const API_URL= import.meta.env.VITE_API_URL
const HistoryComponent = ({ token }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(API_URL+'/chat/history', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setHistory(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchHistory();
  }, [token]);

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl mb-4">Chat History</h2>
      <ul className="space-y-2 w-full">
        {history.map((item) => (
          <li key={item.id} className="border p-2">
            <p><strong>{item.role}:</strong> {item.content}</p>
            <p className="text-gray-500">{new Date(item.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryComponent;
