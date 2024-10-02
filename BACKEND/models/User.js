const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    bookmarks: [{
        story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' }, // Reference to Story
        index: { type: Number, required: true } // Store the index alongside the story reference
    }],
});

UserSchema.index({ 'bookmarks.story': 1, 'bookmarks.index': 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);
