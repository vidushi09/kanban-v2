import React from "react";

const AddColumnForm = ({ newColumn, setNewColumn, handleAddColumn }) => {
  return (
    <div className="add-column-form">
      <input
        type="text"
        value={newColumn}
        onChange={(e) => setNewColumn(e.target.value)}
        placeholder="Enter column name"
        className="p-2 border rounded w-full"
      />
      <button onClick={handleAddColumn} className="bg-blue-500 text-white p-2 rounded mt-2">
        Add Column
      </button>
    </div>
  );
};

export default AddColumnForm;
