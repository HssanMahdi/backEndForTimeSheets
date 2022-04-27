const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var CVSchema = new Schema({


technicalSkills:[{ type: String }],
functionalSkills:[{ type: String }],
projects:[{ type: String }],
videos:[{type:String}],


//  images: {
//         type: "String",
//         required: true,
//         default:
//             "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
//     },
    // employee : { type: Schema.ObjectId, 
    //     ref: 'employees' },

},

    {
        timestamps: true
    });



var cvEmployee = mongoose.model('CV', CVSchema);

module.exports = cvEmployee