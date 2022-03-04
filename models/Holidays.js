const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var HolidaySchema = new Schema({
holidayName:String,
holidayDate: Date
}
);

var holiday = mongoose.model('holiday', HolidaySchema);

module.exports = holiday