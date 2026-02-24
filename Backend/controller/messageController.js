import Message from '../models/Message.js';

export const getConversation = async (req, res) => {
  try {
    const { userId, otherUserId } = req.body;

    if (!userId || !otherUserId) {
      return res.status(400).json({ message: 'userId aur otherUserId chahiye' });
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'username name');

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversation' });
  }
};

export const getAllConversationsForAdmin = async (req, res) => {
  try {
    const { adminId } = req.body; 

    if (!adminId) {
      return res.status(400).json({ message: 'adminId chahiye' });
    }

    const messages = await Message.find({ receiver: adminId })
      .populate('sender', 'username name')
      .sort({ createdAt: -1 });

    const grouped = {};
    messages.forEach(msg => {
      const studentId = msg.sender._id.toString();
      if (!grouped[studentId]) {
        grouped[studentId] = {
          studentId,
          username: msg.sender.username || msg.sender.name,
          lastMessage: msg.content,
          lastTime: msg.createdAt,
          unreadCount: 0
        };
      }
      if (!msg.isRead) grouped[studentId].unreadCount++;
    });

    res.status(200).json(Object.values(grouped));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin conversations' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    await Message.updateMany(
      { receiver: userId, sender: otherUserId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking read' });
  }
};