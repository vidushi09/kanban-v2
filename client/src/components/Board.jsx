import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Column from "./Column";
import UserInfo from "./UserInfo";
import AddColumnForm from "./AddColumnForm";
import CardModal from "./CardModal";
import config from '../config';

export default function Board() {
  const [board, setBoard] = useState(null);
  const [user, setUser] = useState({ name: "", email: "" });
  const [newColumn, setNewColumn] = useState("");
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [editedCard, setEditedCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch user details
    axios
      .get(`${config.apiBaseUrl}/api/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      });

    // Fetch board details
    axios
      .get(`${config.apiBaseUrl}/api/boards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBoard(response.data);
      })
      .catch((error) => {
        console.error("Error fetching board:", error);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      });
  }, [navigate]);

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // If dropped outside a column or in the same position, return
    if (!destination || 
        (source.droppableId === destination.droppableId && 
         source.index === destination.index)) return;

    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `${config.apiBaseUrl}/api/cards/move/${draggableId}`,
        {
          fromColumnId: source.droppableId,
          toColumnId: destination.droppableId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newBoard = { ...board };
      const sourceColumn = newBoard.columns.find(col => col._id === source.droppableId);
      const destinationColumn = newBoard.columns.find(col => col._id === destination.droppableId);

      const [movedCard] = sourceColumn.cards.splice(source.index, 1);
      destinationColumn.cards.splice(destination.index, 0, movedCard);

      setBoard(newBoard);
    } catch (error) {
      console.error("Error moving card:", error);
    }
  };

  const handleAddCard = async (columnId, cardData) => {
    const token = localStorage.getItem("token");
  
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/api/cards`,
        { ...cardData, columnId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const newCard = response.data;
  
      // Update the board state by adding the new card to the correct column
      setBoard((prevBoard) => {
        const updatedColumns = prevBoard.columns.map((col) =>
          col._id === columnId
            ? { ...col, cards: [...col.cards, newCard] } // Add the new card to the column
            : col
        );
        return { ...prevBoard, columns: updatedColumns };
      });
  
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  const handleEditCard = async (updatedCard) => {
    const token = localStorage.getItem("token");

    try {
      console.log("Editing card with ID:", updatedCard._id);
  
      const response = await axios.put(
        `${config.apiBaseUrl}/api/cards/${updatedCard._id}`,
        {
          title: updatedCard.title,
          description: updatedCard.description,
          dueDate: updatedCard.dueDate,
          priority: updatedCard.priority,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Successfully updated card:", response.data);
  
       // Update the card in the board state
    setBoard((prevBoard) => {
      const newBoard = { ...prevBoard };
      newBoard.columns = newBoard.columns.map((column) => {
        const updatedCards = column.cards.map((card) =>
          card._id === updatedCard._id ? response.data : card
        );
        return { ...column, cards: updatedCards };
      });
      return newBoard;
    });
    } catch (error) {
      console.error("Error in handleEditCard:", error.response?.data || error.message);
    }
  };

const handleDeleteCard = async (cardId) => {
  const token = localStorage.getItem("token");

  try {
    console.log("Deleting card with ID:", cardId);

    await axios.delete(`${config.apiBaseUrl}/api/cards/${cardId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Card deleted successfully");

    // Remove the card from the board state
    setBoard((prevBoard) => {
      const newBoard = { ...prevBoard };
      newBoard.columns = newBoard.columns.map((column) => {
        const updatedCards = column.cards.filter((card) => card._id !== cardId);
        return { ...column, cards: updatedCards };
      });
      return newBoard;
    });
  } catch (error) {
    console.error("Error in handleDeleteCard:", error.response?.data || error.message);
  }
};


const handleAddColumn = async () => {
  if (!newColumn.trim()) {
    alert("Column name is required.");
    return;
  }

  const token = localStorage.getItem("token");

  try {
    const columnData = { title: newColumn };
    const response = await axios.post(`${config.apiBaseUrl}/api/columns`, columnData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const newColumnData = response.data;

    // Use functional update to ensure the latest state is used
    setBoard((prevBoard) => {
      if (!prevBoard) return { columns: [newColumnData] }; // Fallback for null state
      // Add the new column to the existing columns array
      return { ...prevBoard, columns: [...prevBoard.columns, newColumnData] };
    });

    setNewColumn(""); // Reset the input field
  } catch (error) {
    console.error("Error adding column:", error);
  }
};

  
  const handleEditColumn = async (columnId, newTitle) => {
    if (!newTitle.trim()) return; // Prevent empty titles
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `${config.apiBaseUrl}/api/columns/${columnId}`,
        { title: newTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newBoard = { ...board };
      const column = newBoard.columns.find(col => col._id === columnId);
      column.title = newTitle;
      setBoard(newBoard);
    } catch (error) {
      console.error("Error editing column:", error);
    }
  };

  const handleDeleteColumn = async (columnId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `${config.apiBaseUrl}/api/columns/${columnId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newBoard = { ...board };
      newBoard.columns = newBoard.columns.filter(col => col._id !== columnId);
      setBoard(newBoard);
    } catch (error) {
      console.error("Error deleting column:", error);
    }
  };

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");
  
    // Redirect the user to the login page
    navigate("/login");
  };

  if (!board) return <div>Loading...</div>;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="container mx-auto px-6 py-8">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-800">Task Board</h1>
          <UserInfo user={user} logout={handleLogout} />
        </header>

        <div className="flex justify-between items-center mb-8">
          <AddColumnForm 
            newColumn={newColumn} 
            setNewColumn={setNewColumn} 
            handleAddColumn={handleAddColumn}
          />
        </div>

        <div className="flex space-x-4 overflow-x-auto">
          {board.columns.map((column) => (
            <Column
              key={column._id}
              column={column}
              onEditColumn={handleEditColumn}
              onDeleteColumn={handleDeleteColumn}
              onAddCard={handleAddCard}
              onEditCard={handleEditCard}
              onDeleteCard={handleDeleteCard}
            />
          ))}
        </div>

        {isEditingCard && (
          <CardModal
            card={editedCard}
            setEditedCard={setEditedCard}
            setIsEditingCard={setIsEditingCard}
          />
        )}
      </div>
    </DragDropContext>
  );
}
