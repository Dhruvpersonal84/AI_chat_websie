import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true
    },
    content: {
        type: String,
        required: true
    }, 
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const ThreadSchema = new mongoose.Schema(
  {
    threadId: {
      type: String,
      required: true,
      unique: true
    },
    title: {
      type: String,
      default: "New Chat"
    },
    messages: [MessageSchema]
  },
  {
    timestamps: true // ✅ handles createdAt & updatedAt automatically
  }
);


export default mongoose.model("Thread", ThreadSchema);