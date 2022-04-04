const mongoose = require('mongoose');
const bcrypt = require("bcrypt")
require('mongoose-type-email');
const Schema = mongoose.Schema;


var EmployeeSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: Number
    },
    address: {
        type: String
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isManager: {
        type: Boolean,
        default: false
    },

    skills: [{ type: String }],

    todaysWorkedHours: {
        type: Number
    },

    hourPrice: {
        type: Number
    },

    totalWorkedHours: {
        type: Number
    },

    overTimeHours: {
        type: Number
    },

    leavesTaken: {
        type: Number
    },

    leavesLeft: {
        type: Number
    },
    timeLastLogin: {
        type: Date 
    },
    notifications: [{ type: String }],

    images: {
        type: "String",
        required: true,
        default:
            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    events: [{ type: Schema.ObjectId, ref: 'events' }],

    files: [{ type: Schema.ObjectId, ref: 'files' }],

    tasks: [{ type: Schema.ObjectId, ref: 'tasks' }],

    company: { type: Schema.ObjectId, ref: 'companys' },

    leaves: [{ type: Schema.ObjectId, ref: 'leaves' }],

    salary: [{ type: Schema.ObjectId, ref: 'salary' }],

    projects: [{ type: Schema.ObjectId, ref: 'projects' }]
},

    {
        timestamps: true
    });

EmployeeSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

var employees = mongoose.model('employees', EmployeeSchema);

module.exports = employees