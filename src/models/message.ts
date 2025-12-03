import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  from: String,
  to: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
})

export const Message = mongoose.model("Message", MessageSchema)
