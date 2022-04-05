const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
    _id: String,
    documentName: String,
    data: Object,
    employee: { type: Schema.ObjectId, ref: "employees" },
},
  {
    timestamps: true,
  }
)
var document = mongoose.model("DocumentEditor", DocumentSchema);
module.exports = document;