import React from 'react';
import { useNavigate } from 'react-router-dom';

function ExploreCard({ newsletter, newsletterId }) {
  console.log(newsletter)
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/newsletter/${newsletterId}`);
  };

  return (
    <article className='newsletter-card' onClick={handleClick}>
      <div>
        <h3>{newsletter.title}</h3>
        <h5>By {newsletter.author}</h5>
      </div>
      <small>{newsletter.subscribers.length} subscribers</small>
    </article>
  );
}

export default ExploreCard;
