const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var DeductionSchema = new Schema({
name:String,
deductedAmount: Number
}
);

var deduction = mongoose.model('deduction', DeductionSchema);

module.exports = deduction