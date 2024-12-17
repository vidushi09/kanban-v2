const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
}, { timestamps: true });

const columnSchema = new mongoose.Schema({
  title: { type: String, required: true },
  cards: [cardSchema], // Embedding cards directly in columns
});

const boardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true }, // One board per user
  columns: {
    type: [columnSchema],
    default: [
      { title: "To Do", cards: [] },
      { title: "In Progress", cards: [] },
      { title: "In Review", cards: [] },
      { title: "Done", cards: [] },
    ],
  },
}, { timestamps: true });

module.exports = mongoose.model("Board", boardSchema);
