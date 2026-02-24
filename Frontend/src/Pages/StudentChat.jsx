import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const SOCKET_URL = 'http://localhost:5000';
const socket = io(SOCKET_URL);

const StudentChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // LocalStorage se IDs le rahe hain
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const currentUserId = user?._id;

  const otherUserId = localStorage.getItem('adminId'); // admin login ke baad set hota hai

  useEffect(() => {
    if (!currentUserId) {
      console.log('Student ID nahi mila localStorage mein');
      return;
    }

    if (!otherUserId) {
      console.log('Admin ID nahi mila localStorage mein – admin login karo pehle');
      return;
    }

    // Join apna room
    socket.emit('join', currentUserId);

    // History load karo
    const loadHistory = async () => {
      try {
        const res = await axios.post('http://localhost:5000/api/messages/conversation', {
          userId: currentUserId,
          otherUserId
        });
        setMessages(res.data || []);
      } catch (err) {
        console.error('History load failed:', err.response?.data || err.message);
      }
    };
    loadHistory();

    // Real-time new message
    socket.on('newMessage', (newMsg) => {
      if (
        (newMsg.sender === currentUserId && newMsg.receiver === otherUserId) ||
        (newMsg.sender === otherUserId && newMsg.receiver === currentUserId)
      ) {
        setMessages((prev) => {
          // Temp msg ko real se replace
          const updated = prev.map((m) =>
            m._id?.startsWith('temp-') ? newMsg : m
          );
          // Duplicate avoid
          if (!updated.some((m) => m._id === newMsg._id)) {
            return [...updated, newMsg];
          }
          return updated;
        });
      }
    });

    return () => {
      socket.off('newMessage');
    };
  }, [currentUserId, otherUserId]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !currentUserId || !otherUserId) return;

    const msgData = {
      sender: currentUserId,
      receiver: otherUserId,
      content: input.trim()
    };

    socket.emit('sendMessage', msgData);

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      {
        ...msgData,
        _id: 'temp-' + Date.now(),
        createdAt: new Date().toISOString()
      }
    ]);

    setInput('');
  };

  if (!currentUserId) {
    return (
      <div className="p-6 text-center text-red-600 font-medium">
        Student login karo pehle (user ID nahi mila).
      </div>
    );
  }

  if (!otherUserId) {
    return (
      <div className="p-6 text-center text-red-600 font-medium">
        Admin ID nahi mila localStorage mein. Admin login karo pehle.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] border border-gray-300 rounded-xl shadow-xl bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
        <h3 className="font-bold text-lg">Support / Doubt Chat</h3>
        <p className="text-sm opacity-90">Admin se direct baat karo</p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            Abhi koi message nahi hai. Pehla message bhejo!
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg._id || index}
              className={`flex ${msg.sender === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[78%] px-4 py-3 rounded-2xl shadow-sm ${
                  msg.sender === currentUserId
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-900 rounded-bl-none'
                }`}
              >
                {msg.sender !== currentUserId && (
                  <div className="font-semibold text-blue-700 mb-1 text-sm">Admin</div>
                )}
                <div className="text-[15px] leading-relaxed">{msg.content}</div>
                <div className="text-xs mt-1 opacity-70 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t bg-white flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
          placeholder="Apna doubt ya request type karo..."
          className="flex-1 border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className={`px-6 py-3 rounded-full font-medium transition-colors ${
            input.trim()
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default StudentChat;