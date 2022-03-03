const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ProjectSchema = new Schema({
projectName:{
    type: String,
    required: true

},
startDate:{
    type: Date,
    required: true

},
endDate:{
    type: Date,
    required: true
},
description:{ 
    type: String,
    required: true},

technologies:[{type: String,
        required: true}],

tasks : [{ type: Schema.ObjectId, ref: 'Task' }],
employees : [{ type: Schema.ObjectId, ref: 'Employee' }]

},
{ timestamps: true
}
);

var projects = mongoose.model('projects', ProjectSchema);

module.exports = projects