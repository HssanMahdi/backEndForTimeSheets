const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var TaskSchema = new Schema({
taskName:{
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

    taskType: {
        type:String,
        enum:['todo','doing','done'],
        default:'todo'
    },


        Project : { type: Schema.ObjectId, ref: 'projects' },
        employees : [{ type: Schema.ObjectId, ref: 'employees' }]

},
{ timestamps: true
}
);

var tasks = mongoose.model('tasks', TaskSchema);

module.exports = tasks