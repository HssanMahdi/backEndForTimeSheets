const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var EventSchema = new Schema({
eventName:{
    type :String
},
fileName:{
    type:String
},
startDate:{
    type: Date,
    required: true
},
endDate:{
    type: Date,
    required: true
},

participants : [{ type: Schema.ObjectId, ref: 'Employee' }]

}
);

var event = mongoose.model('events', EventSchema);

module.exports = event