import Message from '../models/Message.js';

export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    socket.on('join', (userId) => {
      if (!userId) return;
      socket.userId = userId;
      socket.join(userId);  
      console.log(`User ${userId} joined room ${userId}`);
    });

    socket.on('sendMessage', async (data) => {
      const { sender, receiver, content } = data;

      if (!sender || !receiver || !content?.trim()) return;

      try {
        const newMessage = new Message({
          sender,
          receiver,
          content: content.trim()
        });

        await newMessage.save();

        io.to(receiver).emit('newMessage', newMessage);
        io.to(sender).emit('newMessage', newMessage);

        console.log(`Message sent from ${sender} to ${receiver}`);
      } catch (err) {
        console.error('Socket message save error:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
    });
  });
};