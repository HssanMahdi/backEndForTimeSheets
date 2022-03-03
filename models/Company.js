const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var CompanySchema = new Schema({
name:{
    type: String
},
},
{ timestamps: true
});

var Companys = mongoose.model('Companys', CompanySchema);

module.exports = Companys