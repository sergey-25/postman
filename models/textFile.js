const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const textFileSchema = new Schema({
    data:{
        data: Buffer,
        contentType: String
    }
});
const TextFile = mongoose.model('Text', textFileSchema);
module.exports = TextFile;
