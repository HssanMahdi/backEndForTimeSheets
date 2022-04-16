const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var MessageSchema = new Schema(
  {
    content: {
      type: String,
      trim: true,
    },
    isFile: {
      type: Boolean,
      default: false,
    },
    sender: { type: Schema.ObjectId, ref: "employees" },
    chat: { type: Schema.ObjectId, ref: "chats" },
  },
  {
    timestamps: true,
  }
);

var messages = mongoose.model("messages", MessageSchema);

module.exports = messages;
