import React from 'react';
import { useNavigate } from 'react-router-dom';

function EditionCard({ details, paid }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/payment/${details.newsletter}/${details.id}`);
  };

  return (
    <div className="text-card">

      <div className="edition-details">
        <h4 className="color-text card-title">{details.title}</h4>
        <p className="card-body">{details.preview}</p>
      </div>

      <div className="price">
        {paid
          ? (
            <p>
              Price:
              {` ${details.price} sats`}
            </p>
          )
          : (
            <p>
              Price:
              {` ${details.price} sats`}
              <br />
              <button type="button" className="gradient-btn buy-btn" onClick={handleClick}>Buy!</button>
            </p>
          )}
      </div>
    </div>
  );
}

export default EditionCard;
