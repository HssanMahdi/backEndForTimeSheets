const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SingleFileSchema = new Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: String,
      required: true,
    },
    participants:[{
      type: mongoose.Schema.Types.ObjectId, ref: 'employees',
    }],
  },
  {
    timestamps: true,
  }
);

var file = mongoose.model("SingleFiles", SingleFileSchema);

module.exports = file;
