import React from 'react';
import { useNavigate } from 'react-router-dom';

function EditionCard({ details }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/payment/${details.newsletter}/${details.id}`);
  };

  return (
    <div className="text-card">
      <p className="color-text card-title">{details.title}</p>
      <p>
        Price:
        {`${details.price} sats`}
      </p>
      <button type="button" className="gradient-btn" onClick={handleClick}>Buy!</button>
      <div className="center">
        <p className="color-text card-body">{details.preview}</p>
      </div>
    </div>
  );
}

export default EditionCard;
