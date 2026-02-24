import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Send, CheckCheck, User, Shield } from 'lucide-react';

const SOCKET_URL = 'http://localhost:5000';
const socket = io(SOCKET_URL);

const StudentChat = ({ currentUserId: propUserId, otherUserId: propOtherId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  const currentUserId = propUserId || user?._id;
  const otherUserId = propOtherId || localStorage.getItem('adminId');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!currentUserId || !otherUserId) return;
    socket.emit('join', currentUserId);

    const loadHistory = async () => {
      try {
        const res = await axios.post(`${SOCKET_URL}/api/messages/conversation`, {
          userId: currentUserId,
          otherUserId
        });
        setMessages(res.data || []);
      } catch (err) { console.error('History error:', err); }
    };
    loadHistory();

    socket.on('newMessage', (newMsg) => {
      if ((newMsg.sender === currentUserId && newMsg.receiver === otherUserId) ||
          (newMsg.sender === otherUserId && newMsg.receiver === currentUserId)) {
        
        setMessages((prev) => {
          const isDuplicate = prev.some(m => 
            m._id === newMsg._id || 
            (m.content === newMsg.content && m.sender === newMsg.sender && m._id?.startsWith('temp-'))
          );
          
          if (isDuplicate) {
            return prev.map(m => (m.content === newMsg.content && m._id?.startsWith('temp-')) ? newMsg : m);
          }
          return [...prev, newMsg];
        });
      }
    });

    return () => socket.off('newMessage');
  }, [currentUserId, otherUserId]);

  const sendMessage = () => {
    if (!input.trim() || !currentUserId || !otherUserId) return;
    
    const tempId = 'temp-' + Date.now();
    const msgData = { 
      _id: tempId,
      sender: currentUserId, 
      receiver: otherUserId, 
      content: input.trim(),
      createdAt: new Date().toISOString() 
    };

    setMessages((prev) => [...prev, msgData]);
    
    socket.emit('sendMessage', {
      sender: currentUserId,
      receiver: otherUserId,
      content: input.trim()
    });

    setInput('');
  };

  return (
    <div className="flex flex-col h-screen w-full bg-black font-sans overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-32 custom-scrollbar bg-black flex flex-col">
        <div className="max-w-3xl w-full mx-auto mt-auto">
          {messages.length === 0 ? (
            <div className="h-[70vh] flex flex-col items-center justify-center text-center">
              <Shield size={32} className="text-gray-800 mb-2" />
              <p className="text-gray-600 text-sm">Secure chat active</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => {
                const isMe = msg.sender === currentUserId;
                return (
                  <div key={msg._id || index} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${isMe ? 'bg-blue-600' : 'bg-gray-800'}`}>
                        {isMe ? <User size={14} className="text-white" /> : <Shield size={14} className="text-gray-400" />}
                      </div>
                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`px-4 py-2 rounded-2xl text-[14px] ${
                          isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-[#1a1a1a] text-gray-100 rounded-tl-none border border-gray-800'
                        }`}>
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1 opacity-40 text-[9px] font-bold text-gray-500 uppercase">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isMe && <CheckCheck size={12} />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 bg-black border-t border-gray-900 p-4 pb-8">
        <div className="max-w-3xl mx-auto flex items-center bg-[#0f0f0f] border border-gray-800 rounded-2xl p-1.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none px-4 py-2 text-sm outline-none text-white placeholder-gray-600"
          />
          <button onClick={sendMessage} disabled={!input.trim()} className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${input.trim() ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-700'}`}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentChat;