import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import Card from "./Card";
import { PencilIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/solid"; // Import Heroicons

const Column = ({ column, onEditColumn, onDeleteColumn, onAddCard, onEditCard, onDeleteCard }) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCard, setNewCard] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
  });

  const [isEditingColumn, setIsEditingColumn] = useState(false);
  const [columnName, setColumnName] = useState(column.title);

  const handleColumnNameChange = () => {
    if (columnName !== column.title) {
      onEditColumn(column._id, columnName);
    }
    setIsEditingColumn(false);
  };

  const handleAddCard = () => {
    if (newCard.title.trim()) {
      onAddCard(column._id, newCard);
      setNewCard({ title: "", description: "", dueDate: "", priority: "Low" });
      setIsAddingCard(false);
    } else {
      alert("Card title is required.");
    }
  };

  return (
    <div className="column bg-gray-100 p-4 rounded-lg w-64 m-2 shadow-lg flex flex-col">
      <div className="flex justify-between items-center mb-4">
        {isEditingColumn ? (
          <input
            type="text"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            className="p-2 border border-gray-300 rounded w-48 text-lg font-medium"
          />
        ) : (
          <h2 className="text-xl font-semibold text-gray-700">{column.title}</h2>
        )}
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditingColumn(!isEditingColumn)}
            className="text-yellow-500 p-1 rounded hover:bg-yellow-200 transition"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDeleteColumn(column._id)}
            className="text-red-500 p-1 rounded hover:bg-red-200 transition"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
          {isEditingColumn && (
            <button
              onClick={handleColumnNameChange}
              className="text-green-500 p-1 rounded hover:bg-green-200 transition"
            >
              <CheckIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <Droppable droppableId={column._id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="mt-4 space-y-2 flex-1 overflow-y-auto"
          >
            {column.cards.map((card, index) => (
              <Card
                key={card._id}
                card={card}
                index={index}
                onEditCard={onEditCard}
                onDeleteCard={onDeleteCard}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {isAddingCard ? (
        <div className="add-card-form bg-white p-4 rounded-lg shadow-lg mt-4">
          <input
            type="text"
            placeholder="Card Title"
            value={newCard.title}
            onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <textarea
            placeholder="Description"
            value={newCard.description}
            onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <input
            type="date"
            value={newCard.dueDate}
            onChange={(e) => setNewCard({ ...newCard, dueDate: e.target.value })}
            className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <select
            value={newCard.priority}
            onChange={(e) => setNewCard({ ...newCard, priority: e.target.value })}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <div className="flex justify-between">
            <button onClick={handleAddCard} className="bg-green-500 text-white p-2 rounded-lg shadow-md hover:bg-green-600 transition">
              Save
            </button>
            <button
              onClick={() => setIsAddingCard(false)}
              className="bg-red-500 text-white p-2 rounded-lg shadow-md hover:bg-red-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingCard(true)}
          className="bg-blue-500 text-white p-2 rounded-lg mt-4 w-full hover:bg-blue-600 transition"
        >
          + Add Card
        </button>
      )}
    </div>
  );
};

export default Column;
