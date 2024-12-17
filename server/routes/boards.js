const express = require("express");
const Board = require("../models/board");
const router = express.Router();

// Create a board for the logged-in user
router.post("/", async (req, res) => {
  try {
    const userId = req.user._id; // Use req.user._id here (user is added in auth middleware)
    
    // Check if the user already has a board
    const existingBoard = await Board.findOne({ user: userId });
    if (existingBoard) {
      return res.status(400).json({ message: "User already has a board" });
    }

    // Create a new board for the user
    const newBoard = new Board({ user: userId });
    await newBoard.save();

    res.status(201).json(newBoard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get the user's board
router.get("/", async (req, res) => {
  try {
    const userId = req.user._id; // Use req.user._id here
    const board = await Board.findOne({ user: userId });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.status(200).json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update the board (e.g., rename the board)
router.put("/", async (req, res) => {
  try {
    const userId = req.user._id; // Use req.user._id here
    const { name } = req.body;

    const board = await Board.findOneAndUpdate(
      { user: userId },
      { name },
      { new: true }
    );

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.status(200).json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
