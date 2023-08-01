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
        <h3 className="color-text newsletter-title">{newsletter.title}</h3>
        <h5 className="newsletter-author">
          By
          {' '}
          {newsletter.author}
        </h5>
      </div>
      <div>
        <p id="newsletter-details">{newsletter.summary}</p>
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
