const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    poll: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true },
    optionIndex: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Ensure a user can only vote once per poll
voteSchema.index({ user: 1, poll: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
