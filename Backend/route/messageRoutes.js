import express from 'express';
import { getAllConversationsForAdmin, getConversation, markAsRead } from '../controller/messageController.js';

const router = express.Router();

router.post('/conversation', getConversation);             
router.post('/all-conversations', getAllConversationsForAdmin);

router.patch('/read/:otherUserId', markAsRead);               


export default router;