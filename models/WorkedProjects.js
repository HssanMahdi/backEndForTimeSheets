const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var WorkedProjectSchema = new Schema({
name:{
    type: String,
    required: true
},

description:{ 
    type: String,
},

technologies:[{type: String,
        required: true}],

employee : { type: Schema.ObjectId, ref: 'employees' },

},
{ timestamps: true
}
);

var workedProjects = mongoose.model('workedProjects', WorkedProjectSchema);
module.exports = workedProjects