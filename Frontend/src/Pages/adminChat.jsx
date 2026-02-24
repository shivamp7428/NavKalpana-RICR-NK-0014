import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentChat from './StudentChat'; // reuse kar rahe hain

const AdminChat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const adminId = localStorage.getItem('adminId');

  useEffect(() => {
    if (!adminId) return;

    const fetchConversations = async () => {
      try {
        const res = await axios.post('http://localhost:5000/api/messages/all-conversations', { adminId });
        setConversations(res.data || []);
      } catch (err) {
        console.error('Admin list load failed:', err);
      }
    };

    fetchConversations();

    // Auto refresh every 5 sec for real-time feel (hackathon demo)
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [adminId]);

  if (!adminId) {
    return <div className="p-10 text-center text-red-600">Admin ID nahi mila. Login karo pehle.</div>;
  }

  return (
    <div className="flex h-[600px] bg-white border rounded-xl shadow-xl overflow-hidden">
      <div className="w-1/3 border-r bg-gray-50 overflow-y-auto">
        <div className="p-4 bg-blue-600 text-white sticky top-0">
          <h3 className="font-bold text-lg">Incoming Student Requests</h3>
        </div>

        {conversations.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">Koi naya message nahi</p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.studentId}
              onClick={() => setSelectedStudentId(conv.studentId)}
              className={`p-4 border-b cursor-pointer hover:bg-blue-50 ${selectedStudentId === conv.studentId ? 'bg-blue-100' : ''}`}
            >
              <div className="font-medium">{conv.username || 'Student'}</div>
              <div className="text-sm text-gray-600 truncate">{conv.lastMessage}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(conv.lastTime).toLocaleString()}
              </div>
              {conv.unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mt-1 inline-block">
                  {conv.unreadCount} new
                </span>
              )}
            </div>
          ))
        )}
      </div>

      <div className="w-2/3">
        {selectedStudentId ? (
          <StudentChat currentUserId={adminId} otherUserId={selectedStudentId} /> // ← role reverse – admin current, student other
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 text-lg">
            Kisi student ko select karo chat shuru karne ke liye
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;