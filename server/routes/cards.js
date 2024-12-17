const express = require("express");
const Board = require("../models/board");
const router = express.Router();

// // Create a card in a specific column
// router.post("/", async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { columnId, title, description, dueDate, priority } = req.body;

//     const board = await Board.findOne({ user: userId });
//     if (!board) return res.status(404).json({ message: "Board not found" });

//     const column = board.columns.id(columnId);
//     if (!column) return res.status(404).json({ message: "Column not found" });

//     const newCard = { title, description, dueDate, priority };
//     column.cards.push(newCard);
//     await board.save();

//     res.status(201).json(newCard);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// Add a new card to a column
router.post("/", async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from the auth middleware
    const { title, description, dueDate, priority, columnId } = req.body;

    // Find the board associated with the user
    const board = await Board.findOne({ user: userId });
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Find the column by its ID
    const column = board.columns.id(columnId);
    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    // Create the new card
    const newCard = { title, description, dueDate, priority };

    // Add the new card to the column's cards array
    column.cards.push(newCard);

    // Save the board with the new card
    await board.save();

    // Return the newly created card with its _id
    const createdCard = column.cards[column.cards.length - 1]; // The last added card
    res.status(201).json(createdCard); // Return the newly created card with its _id

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Update a card
router.put("/:cardId", async (req, res) => {
  try {
    const userId = req.user._id;
    const { cardId } = req.params;
    const { title, description, dueDate, priority } = req.body;

    // Check if required fields are passed in the request body
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Find the board associated with the user
    const board = await Board.findOne({ user: userId });
    if (!board) return res.status(404).json({ message: "Board not found" });

    let cardFound = null;
    // Iterate over columns and find the card
    board.columns.forEach((column) => {
      const card = column.cards.id(cardId);
      if (card) {
        card.title = title || card.title; // Keep existing value if not provided
        card.description = description || card.description;
        card.dueDate = dueDate || card.dueDate;
        card.priority = priority || card.priority;
        cardFound = card;
      }
    });

    if (!cardFound) return res.status(404).json({ message: "Card not found" });

    await board.save();
    res.status(200).json(cardFound);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a card
router.delete("/:cardId", async (req, res) => {
  try {
    const userId = req.user._id;  // Get the user ID from the auth middleware
    const { cardId } = req.params; // Get the card ID from the URL parameter

    // Find the board associated with the user
    const board = await Board.findOne({ user: userId });
    if (!board) return res.status(404).json({ message: "Board not found" });

    // Iterate over columns to find and remove the card
    let cardFound = false;
    board.columns.forEach((column) => {
      // Check if the card exists in the column
      if (column.cards.id(cardId)) {
        column.cards.pull(cardId); // Remove the card from the column
        cardFound = true;
      }
    });

    if (!cardFound) return res.status(404).json({ message: "Card not found" });

    await board.save(); // Save the updated board

    res.status(200).json({ message: "Card deleted" }); // Return success message
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Move a card between columns
router.put("/move/:cardId", async (req, res) => {
  try {
    const userId = req.user._id;
    const { cardId } = req.params;
    const { fromColumnId, toColumnId } = req.body;

    // Find the board associated with the user
    const board = await Board.findOne({ user: userId });
    if (!board) return res.status(404).json({ message: "Board not found" });

    // Find the columns by their respective IDs
    const fromColumn = board.columns.id(fromColumnId);
    const toColumn = board.columns.id(toColumnId);
    if (!fromColumn || !toColumn) return res.status(404).json({ message: "Column not found" });

    // Find the card in the fromColumn
    const card = fromColumn.cards.id(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    // Remove the card from the fromColumn and push to the toColumn
    fromColumn.cards.pull(card); // Remove card from fromColumn
    toColumn.cards.push(card);    // Add card to toColumn

    await board.save(); // Save the board with updated columns

    res.status(200).json(card); // Return the moved card
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
