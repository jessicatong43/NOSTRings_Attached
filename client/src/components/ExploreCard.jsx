import React from 'react';
import { useNavigate } from 'react-router-dom';

function ExploreCard({ newsletter }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/newsletter/${newsletter.id}`);
  };

  return (
    <article className='newsletter-card' onClick={handleClick}>
      <h3>{newsletter.title}</h3>
      <h6>By {newsletter.author}</h6>
    </article>
  );
}

export default ExploreCard;
