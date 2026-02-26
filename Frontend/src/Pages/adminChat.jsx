import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MessageSquare, ShieldCheck, Menu, X, MoreVertical } from 'lucide-react';
import StudentChat from './StudentChat';
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';
const socket = io(SOCKET_URL);

const AdminChat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const adminId = localStorage.getItem('adminId');

  const formatLastSeen = (date) => {
    if (!date) return 'Offline';
    const diff = Math.floor((new Date() - new Date(date)) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    if (!adminId) return;

    socket.emit('join', adminId);

    const fetchConversations = async () => {
      try {
        const res = await axios.post(`${SOCKET_URL}/api/messages/all-conversations`, { adminId });
        setConversations(res.data || []);
      } catch (err) { console.error(err); }
    };

    fetchConversations();

    socket.on('userStatusChanged', (data) => {
      setConversations(prev => prev.map(c => 
        c.studentId === data.userId ? { ...c, isOnline: data.isOnline, lastSeen: data.lastSeen } : c
      ));
    });

    socket.on('newMessage', (msg) => {
      setConversations(prev => prev.map(c => 
        (c.studentId === msg.sender || c.studentId === msg.receiver) 
        ? { ...c, lastMessage: msg.content, lastTime: msg.createdAt } : c
      ));
    });

    return () => {
      socket.off('userStatusChanged');
      socket.off('newMessage');
    };
  }, [adminId]);

  const filteredConversations = conversations.filter(conv => 
    conv.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!adminId) return <div className="h-screen flex items-center justify-center text-red-500 font-bold">Admin access required.</div>;

  return (
    <div className="flex h-screen bg-[#f4f7fe] dark:bg-gray-950 overflow-hidden text-gray-800 dark:text-white font-sans">
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col`}>
        <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between shrink-0">
          <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2"><ShieldCheck size={24} /> Admin Hub</h1>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1.5 bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>

        <div className="p-4 shrink-0 border-b border-gray-50 dark:border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search students..." className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 border border-transparent" onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredConversations.map((conv) => (
            <div key={conv.studentId} onClick={() => setSelectedStudentId(conv.studentId)} className={`p-4 rounded-2xl cursor-pointer flex items-center gap-3 transition-all ${selectedStudentId === conv.studentId ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              <div className="relative">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold ${selectedStudentId === conv.studentId ? 'bg-white/20' : 'bg-blue-100 text-blue-600'}`}>{conv.username?.[0].toUpperCase()}</div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${conv.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold truncate">{conv.username}</span>
                  <span className="text-[10px] opacity-70 whitespace-nowrap">{conv.isOnline ? 'Online' : formatLastSeen(conv.lastTime)}</span>
                </div>
                <p className={`text-xs truncate ${selectedStudentId === conv.studentId ? 'text-blue-50' : 'opacity-60'}`}>{conv.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 lg:ml-80 flex flex-col h-screen bg-white dark:bg-gray-950 overflow-hidden">
        {selectedStudentId ? (
          <StudentChat currentUserId={adminId} otherUserId={selectedStudentId} isAdmin={true} studentName={conversations.find(c => c.studentId === selectedStudentId)?.username} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4">
            <MessageSquare size={80} className="opacity-10" />
            <p className="text-lg font-medium opacity-50">Select a student to chat live</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminChat;