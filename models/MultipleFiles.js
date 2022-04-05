const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MultipleFileSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    files: [Object],
    employee: { type: Schema.ObjectId, ref: "employees" },
  },
  {
    timestamps: true,
  }
);

var file = mongoose.model("MultipleFiles",  MultipleFileSchema);

module.exports = file;
