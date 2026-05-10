const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

exports.getChatList = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.session.user.id
        }).populate('participants').populate('lastMessage');
        res.render('chat-list', { conversations });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getChat = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id)
            .populate('participants');
        const messages = await Message.find({ conversation: conversation._id })
            .sort({ createdAt: 1 });
        res.render('chat', { conversation, messages });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.startConversation = async (req, res) => {
    try {
        const { receiverId } = req.body;
        let conversation = await Conversation.findOne({
            participants: { $all: [req.session.user.id, receiverId] }
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [req.session.user.id, receiverId]
            });
            await conversation.save();
        }
        res.redirect(`/messages/chat/${conversation._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
