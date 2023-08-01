import React from 'react';
import { useNavigate } from 'react-router-dom';

function ExploreCard({ newsletter, newsletterId }) {
  const navigate = useNavigate();


  const handleClick = () => {
    navigate(`/newsletter/${newsletterId}`);
  };

  return (
    <article className="newsletter-card" onClick={handleClick}>
      <div>
        <h3 className="color-text newsletter-card-title">{newsletter.title}</h3>
        <h5 className="newsletter-card-author">
          By
          {' '}
          {newsletter.author}
        </h5>
        <p className="newsletter-card-summary">{newsletter.summary}</p>
      </div>
      <small>
        {newsletter.subscribers?.length}
        {' '}
        subscribers
      </small>
    </article>
  );
}

export default ExploreCard;
