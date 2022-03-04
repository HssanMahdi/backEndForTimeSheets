const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var OverTimeSchema = new Schema({
name:String,
hourlyRate: Number
}
);

var overTime = mongoose.model('overtime', OverTimeSchema);

module.exports = overTime