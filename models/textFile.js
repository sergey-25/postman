const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const textFileSchema = new Schema({
    data: {
        type: String,
        required: false
    }
}, {timestamps: true});


const TextFile = mongoose.model('Text', textFileSchema);
module.exports = TextFile;
