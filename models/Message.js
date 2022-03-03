const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var MessageSchema = new Schema({
content:{
    type: String
},
sender : { type: Schema.ObjectId, ref: 'Employee' },
chat : { type: Schema.ObjectId, ref: 'Chat' }
},
{ 
    timestamps: true
});

var messages = mongoose.model('messages', MessageSchema);

module.exports = messages