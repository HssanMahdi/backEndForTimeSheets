const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var EventSchema = new Schema({
eventName:{
    type :String
},
startDate:{
    type: Date
},
endDate:{
    type: Date
},
eventDescription:{
    type: String
},
// participants : [{ type: Schema.ObjectId, ref: 'employees' }]
participants:[{
    type: mongoose.Schema.Types.ObjectId, ref: 'employees',
  }],

}
);

var event = mongoose.model('events', EventSchema);

module.exports = event