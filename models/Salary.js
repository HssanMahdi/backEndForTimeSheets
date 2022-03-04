const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var SalarySchema = new Schema({
month:String,
year: String,
addition:Number,
overtime:Number,
deductions:Number,
totalSalary:Number,
employees : [{ type: Schema.ObjectId, ref: 'Employee' }]

}
);

var salary = mongoose.model('salary', SalarySchema);

module.exports = salary