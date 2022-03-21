const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var CompanySchema = new Schema({
companyName:{
    type: String
},
},
{ timestamps: true
});

var Companys = mongoose.model('companys', CompanySchema);

module.exports = Companys