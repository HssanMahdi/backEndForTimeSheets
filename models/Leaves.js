const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var LeavesSchema = new Schema({
numberOfdays:Number,
leaveStart: Date,
leaveEnd:Date,
leaveType:String,
reason:String,
status:String,
paidLeave:Boolean,
userName : String,

}
);

var leaves = mongoose.model('leaves', LeavesSchema);

module.exports = leaves