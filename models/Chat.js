const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var ChatSchema = new Schema({
chatName:{
    type:String, trim: true
},
isGroup:{
    type: Boolean
},
employees : [{ type: Schema.ObjectId, ref: 'employees' }],
lastMessage : { type: Schema.ObjectId, ref: 'messages' }, 
groupAdmin : { type: Schema.ObjectId, ref: 'employees' }
},
{ timestamps: true
});

var chats = mongoose.model('chats', ChatSchema);

module.exports = chats