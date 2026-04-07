const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    options: [{
        text: { type: String, required: true },
        votes: { type: Number, default: 0 }
    }],
    isClosed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Poll', pollSchema);
