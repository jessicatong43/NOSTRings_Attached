import React from 'react';
import ExploreCard from './ExploreCard';

function Explore({ newsletters }) {
  let content = <section id="explore">Explore</section>;

  if (newsletters?.length) {
    content = (
      <section id="explore">
        {newsletters.map((newsletter) => (
          <ExploreCard
            newsletter={newsletter}
            key={newsletter.id}
            newsletterId={newsletter.id}
          />
        ))}
      </section>
    );
  }

  return content;
}

export default Explore;
