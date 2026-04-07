const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const newComment = new Comment({
            user: req.user.id,
            poll: req.params.id,
            text
        });
        await newComment.save();
        const populatedComment = await Comment.findById(newComment._id).populate('user', 'username');
        res.json(populatedComment);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ poll: req.params.id }).populate('user', 'username').sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
