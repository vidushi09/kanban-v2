import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import Card from "./Card";
import { PencilIcon, TrashIcon, CheckIcon, PlusIcon } from "@heroicons/react/24/solid";

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

  // Determine column color based on its title or position
  const getColumnColor = () => {
    const colors = {
      'Todo': 'from-blue-100 to-blue-200',
      'In Progress': 'from-yellow-100 to-yellow-200',
      'Done': 'from-green-100 to-green-200'
    };
    return colors[column.title] || 'from-gray-100 to-gray-200';
  };

  return (
    <div className={`column bg-gradient-to-br ${getColumnColor()} p-5 rounded-2xl w-72 m-3 shadow-xl 
      transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
      <div className="flex justify-between items-center mb-4 border-b pb-3 border-gray-300/50">
        {isEditingColumn ? (
          <input
            type="text"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-48 text-lg font-medium 
            focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        ) : (
          <h2 className="text-2xl font-bold text-gray-800 tracking-wider">{column.title}</h2>
        )}
        <div className="flex space-x-1">
          <button
            onClick={() => setIsEditingColumn(!isEditingColumn)}
            className="text-yellow-600 p-2 rounded-full hover:bg-yellow-100 transition"
            title="Edit Column"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDeleteColumn(column._id)}
            className="text-red-600 p-2 rounded-full hover:bg-red-100 transition"
            title="Delete Column"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
          {isEditingColumn && (
            <button
              onClick={handleColumnNameChange}
              className="text-green-600 p-2 rounded-full hover:bg-green-100 transition"
              title="Save Column Name"
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
            className="mt-4 space-y-3 flex-1 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
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
        <div className="add-card-form bg-white p-5 rounded-xl shadow-lg mt-4 space-y-3 border border-gray-200">
          <input
            type="text"
            placeholder="Card Title"
            value={newCard.title}
            onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <textarea
            placeholder="Description"
            value={newCard.description}
            onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={newCard.dueDate}
              onChange={(e) => setNewCard({ ...newCard, dueDate: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <select
              value={newCard.priority}
              onChange={(e) => setNewCard({ ...newCard, priority: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>
          <div className="flex justify-between space-x-2">
            <button 
              onClick={handleAddCard} 
              className="flex-1 bg-green-500 text-white p-2 rounded-lg shadow-md 
              hover:bg-green-600 transition flex items-center justify-center space-x-2"
            >
              <CheckIcon className="h-5 w-5" />
              <span>Save Card</span>
            </button>
            <button
              onClick={() => setIsAddingCard(false)}
              className="flex-1 bg-red-500 text-white p-2 rounded-lg shadow-md 
              hover:bg-red-600 transition flex items-center justify-center space-x-2"
            >
              <TrashIcon className="h-5 w-5" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingCard(true)}
          className="bg-blue-500 text-white p-3 rounded-lg mt-4 w-full 
          hover:bg-blue-600 transition flex items-center justify-center space-x-2 
          shadow-md hover:shadow-lg"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add New Card</span>
        </button>
      )}
    </div>
  );
};

export default Column;