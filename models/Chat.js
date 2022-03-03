const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var ChatSchema = new Schema({
isGroup:{
    type: Boolean
},
employees : [{ type: Schema.ObjectId, ref: 'Employee' }],
lastMessage : { type: Schema.ObjectId, ref: 'Message' }, 
groupAdmin : { type: Schema.ObjectId, ref: 'Employee' }
},
{ timestamps: true
});

var chats = mongoose.model('chats', ChatSchema);

module.exports = chats