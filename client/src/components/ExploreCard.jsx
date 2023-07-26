import React from 'react';

function ExploreCard({ newsletter }) {
  return (
    <article className='newsletter-card'>
      <h3>{newsletter.title}</h3>
      <h6>By {newsletter.Author}</h6>
    </article>
  );
}

export default ExploreCard;
