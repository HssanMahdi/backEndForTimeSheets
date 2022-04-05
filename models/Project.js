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

tasks : [{ type: Schema.ObjectId, 
           ref: 'tasks',
           default:null }],
employees : [{ type: Schema.ObjectId,
     ref: 'employees',
     default:null }],
     
projectLeader : { type: Schema.ObjectId,
     ref: 'employees',
     default:null }
},
{ timestamps: true
}
);

var projects = mongoose.model('projects', ProjectSchema);

module.exports = projects