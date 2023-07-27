import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

function EditionList({ details }) {
  console.log(details);

  return (
    <div className="text-card">
      <p className="color-text card-title">{details.title}</p>
      <p>
        Price:
        {`${details.price} sats`}

      </p>
      <div className="center">
        <p className="color-text card-body">{details.preview}</p>
      </div>
    </div>
  );
}

export default EditionList;
