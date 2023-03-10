const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    birth_date: {
        type: Date,
        required: false
    },
    first_name: {
        type: String,
        required: false
    },
    last_name: {
        type: String,
        required: false
    },
    person_id: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
    }
}, {timestamps: true});


const Post = mongoose.model('Post', postSchema);
module.exports = Post;


