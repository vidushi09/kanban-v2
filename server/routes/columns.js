const express = require("express");
const Board = require("../models/board");
const router = express.Router();

// // Create a column for the user's board
// router.post("/", async (req, res) => {
//   try {
//     const userId = req.user._id; // Get the user ID from the auth middleware
//     const { title } = req.body; // Get the column title from the request body

//     // Find the board associated with the user
//     const board = await Board.findOne({ user: userId });
//     if (!board) {
//       return res.status(404).json({ message: "Board not found" });
//     }

//     // Add the new column to the board's columns array
//     const newColumn = { title, cards: [] };
//     board.columns.push(newColumn);

//     // Save the board with the new column
//     await board.save();

//     res.status(201).json(newColumn); // Return the newly created column
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// Create a column for the user's board
router.post("/", async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from the auth middleware
    const { title } = req.body; // Get the column title from the request body

    // Find the board associated with the user
    const board = await Board.findOne({ user: userId });
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Add the new column to the board's columns array
    const newColumn = { title, cards: [] };
    board.columns.push(newColumn);

    // Save the board with the new column
    await board.save();

    // Return the newly created column along with the assigned _id
    const createdColumn = board.columns[board.columns.length - 1]; // The last added column
    res.status(201).json(createdColumn); // Return the newly created column with its _id

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Update a column (e.g., renaming the column)
router.put("/:columnId", async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from the auth middleware
    const { columnId } = req.params; // Get the column ID from the URL parameter
    const { title } = req.body; // Get the new title from the request body

    // Find the board associated with the user
    const board = await Board.findOne({ user: userId });
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Find the column by its index in the columns array
    const column = board.columns.id(columnId);
    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    // Update the column title
    column.title = title;
    await board.save();

    res.status(200).json(column); // Return the updated column
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a column
router.delete("/:columnId", async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from the auth middleware
    const { columnId } = req.params; // Get the column ID from the URL parameter

    // Find the board associated with the user
    const board = await Board.findOne({ user: userId });
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Use the pull method to remove the column from the board's columns array
    const columnIndex = board.columns.findIndex(col => col._id.toString() === columnId);

    if (columnIndex === -1) {
      return res.status(404).json({ message: "Column not found" });
    }

    // Remove the column from the array
    board.columns.splice(columnIndex, 1);
    await board.save(); // Save the updated board

    res.status(200).json({ message: "Column deleted" }); // Return success message
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
