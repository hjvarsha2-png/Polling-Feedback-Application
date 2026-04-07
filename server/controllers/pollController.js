const Poll = require('../models/Poll');
const Vote = require('../models/Vote');
const Comment = require('../models/Comment');

exports.createPoll = async (req, res) => {
    try {
        const { title, description, options } = req.body;
        const newPoll = new Poll({
            creator: req.user.id,
            title,
            description,
            options: options.map(opt => ({ text: opt, votes: 0 }))
        });
        await newPoll.save();
        res.json(newPoll);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPolls = async (req, res) => {
    try {
        const polls = await Poll.find().sort({ createdAt: -1 });
        res.json(polls);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPoll = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) return res.status(404).json({ message: 'Poll not found' });

        // Check if the current user has voted on this poll
        let hasVoted = false;
        if (req.user) {
            const vote = await Vote.findOne({ user: req.user.id, poll: req.params.id });
            if (vote) hasVoted = true;
        }

        // Return results only if user has voted or user is the creator or poll is closed
        const isCreator = req.user && poll.creator.toString() === req.user.id;
        const showResults = hasVoted || isCreator || poll.isClosed;

        const pollData = poll.toObject();
        if (!showResults) {
            pollData.options = pollData.options.map(opt => ({ text: opt.text })); // Hide vote counts
        }

        res.json({ ...pollData, hasVoted });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.vote = async (req, res) => {
    try {
        const { optionIndex } = req.body;
        const poll = await Poll.findById(req.params.id);
        if (!poll) return res.status(404).json({ message: 'Poll not found' });
        if (poll.isClosed) return res.status(400).json({ message: 'Poll is closed' });

        const existingVote = await Vote.findOne({ user: req.user.id, poll: req.params.id });
        if (existingVote) return res.status(400).json({ message: 'You have already voted' });

        const vote = new Vote({
            user: req.user.id,
            poll: req.params.id,
            optionIndex
        });
        await vote.save();

        poll.options[optionIndex].votes += 1;
        await poll.save();

        res.json({ message: 'Vote recorded', poll });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.closePoll = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) return res.status(404).json({ message: 'Poll not found' });
        if (poll.creator.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        poll.isClosed = true;
        await poll.save();
        res.json(poll);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deletePoll = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) return res.status(404).json({ message: 'Poll not found' });
        if (poll.creator.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        await Poll.findByIdAndDelete(req.params.id);
        // Optional: Delete associated votes and comments
        await Vote.deleteMany({ poll: req.params.id });
        await Comment.deleteMany({ poll: req.params.id });

        res.json({ message: 'Poll deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
