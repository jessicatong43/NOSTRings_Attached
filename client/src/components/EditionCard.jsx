import React from 'react';
import { useNavigate } from 'react-router-dom';

function EditionCard({ details }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/payment/${details.newsletter}/${details.id}`);
  };

  return (
    <div className="text-card">

      <div className="edition-details">
        <h4 className="color-text card-title">{details.title}</h4>
        <p>
          Price:
          {` ${details.price} sats`}
          <button type="button" className="buy-btn gradient-btn" onClick={handleClick}>Buy!</button>
        </p>

      </div>

      <div className="center">
        <p className="color-text card-body">{details.preview}</p>
      </div>
    </div>
  );
}

export default EditionCard;
