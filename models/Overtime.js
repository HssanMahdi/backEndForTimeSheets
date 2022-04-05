const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var OverTimeSchema = new Schema({
name:String,
hourlyRate: Number,
working_hours_per_day:Number

}
);

var overTime = mongoose.model('overtime', OverTimeSchema);

module.exports = overTime