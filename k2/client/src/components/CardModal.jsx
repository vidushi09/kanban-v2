import React from "react";

const CardModal = ({ card, setEditedCard, setIsEditingCard }) => {
  const handleSave = () => {
    // Save card logic
    setIsEditingCard(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Card</h2>
        <input
          type="text"
          value={card.title}
          onChange={(e) => setEditedCard({ ...card, title: e.target.value })}
        />
        <textarea
          value={card.description}
          onChange={(e) => setEditedCard({ ...card, description: e.target.value })}
        />
        <button onClick={handleSave}>Save</button>
        <button onClick={() => setIsEditingCard(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default CardModal;
