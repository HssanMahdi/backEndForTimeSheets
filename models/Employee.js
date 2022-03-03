const mongoose = require('mongoose');
require('mongoose-type-email');
const Schema = mongoose.Schema;


var EmployeeSchema = new Schema({
firstName:{
    type: String
},
lastName:{
    type: String
},
email:{
    type: mongoose.SchemaTypes.Email
},
phone:{
    type: Number
},
address:{
    type : String
},
userName:{ 
    type: String,
    required: true
},
password:{
	type: String,
    required: true
},
role:{ 
    type: String,
},

skills : [{ type: String }],

todaysWorkedHours:  {
        type: Number,
},

hourPrice:  {
        type: Number,
},
    
totalWorkedHours:{
        type: Number,
},

overTimeHours:{
		type: Number,
},

// leavesTaken:{},

// leavesLeft:{},

//events : [{ type: Schema.ObjectId, ref: 'Event' }],

//files : [{ type: Schema.ObjectId, ref: 'File' }],

//tasks : [{ type: Schema.ObjectId, ref: 'Task' }],

//company : [{ type: Schema.ObjectId, ref: 'Company' }],

//leaves : [{ type: Schema.ObjectId, ref: 'Leaves' }],

//salary : [{ type: Schema.ObjectId, ref: 'Salary' }],

projects : [{ type: Schema.ObjectId, ref: 'Project' }]
},

{ timestamps: true
    });

var employees = mongoose.model('employees', EmployeeSchema);

module.exports = employees