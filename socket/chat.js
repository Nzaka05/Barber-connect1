const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('join', (userId) => {
            socket.join(userId);
        });

        socket.on('sendMessage', async (data) => {
            try {
                const { conversationId, senderId, receiverId, content } = data;

                // Save message to DB
                const newMessage = new Message({
                    sender: senderId,
                    conversation: conversationId,
                    content
                });
                await newMessage.save();

                // Update last message in conversation
                await Conversation.findByIdAndUpdate(conversationId, {
                    lastMessage: newMessage._id
                });

                // Emit to receiver
                io.to(receiverId).emit('message', {
                    conversationId,
                    senderId,
                    content,
                    createdAt: newMessage.createdAt
                });
            } catch (err) {
                console.error('Socket Error:', err);
            }
        });

        socket.on('disconnect', () => {
        });
    });
};
