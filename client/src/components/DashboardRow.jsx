import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import EditionCard from './EditionCard';
import ExploreCard from './ExploreCard';

function DashboardRow({ data, title, type }) {

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  if (data?.length === 0) {
    return (
      <div className="text-card">
        <div className="edition-details">
          <h4 className="color-text card-title">
            There's nothing here,
            {' '}
            <Link to="/explore">Explore!</Link>
          </h4>
        </div>
      </div>
    );
  }

  return (
    <div>
      {type === 'edition' ? (
        <div>
          &nbsp; <h4 className="color-text">{title}</h4>
          <Slider {...settings}>
            {data.map((edition) => (
              <EditionCard details={edition} key={edition.title} paid />
            ))}
          </Slider>
        </div>
      ) : (
        <div>
          &nbsp; <h4 className="color-text">{title}</h4>
          <Slider {...settings}>
            {data.map((edition) => (
              <ExploreCard newsletter={edition} newsletterId={edition.id} key={edition.title} />
            ))}
          </Slider>
        </div>
      )}
    </div>

  );
}

export default DashboardRow;
