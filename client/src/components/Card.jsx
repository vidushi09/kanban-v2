import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

const Card = ({ card, index, onEditCard, onDeleteCard }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState({ ...card });

  const priorityClass =
    editedCard.priority === "High"
      ? "bg-red-100 text-red-800"
      : editedCard.priority === "Medium"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-green-100 text-green-800";

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedCard((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = () => {
    onEditCard(editedCard);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedCard({ ...card });
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={card._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="card bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          {isEditing ? (
            <div>
              <input
                type="text"
                name="title"
                value={editedCard.title}
                onChange={handleEditChange}
                className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
              <textarea
                name="description"
                value={editedCard.description}
                onChange={handleEditChange}
                className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
              <input
                type="date"
                name="dueDate"
                value={editedCard.dueDate}
                onChange={handleEditChange}
                className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
              <select
                name="priority"
                value={editedCard.priority}
                onChange={handleEditChange}
                className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                  <CheckIcon className="w-5 h-5 mr-1" /> Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  <XMarkIcon className="w-5 h-5 mr-1" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{card.title}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${priorityClass}`}>
                  {card.priority}
                </span>
              </div>
              {card.description && (
                <p className="text-sm text-gray-600 mt-2">{card.description}</p>
              )}
              {card.dueDate && (
                <p className="text-xs text-gray-500 mt-2">
                  Due: {new Date(card.dueDate).toLocaleDateString()}
                </p>
              )}
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center text-yellow-500 hover:text-yellow-600"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDeleteCard(card._id)}
                  className="flex items-center text-red-500 hover:text-red-600"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Card;
