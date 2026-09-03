const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'Title is required'] },
    content: { type: String, required: [true, 'Content is required'] },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    creationDate: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
        {
            text: { type: String, required: true },
            author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            dateAdded: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model('Post', postSchema);