/* eslint-disable no-nested-ternary */
import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import EditionCard from './EditionCard';
import ExploreCard from './ExploreCard';

function DashboardRow({ data, title, type }) {
  let perRow;
  if (type === 'owned-newsletters') {
    perRow = (data.length + 1) < 2 ? 1 : 2;
  } else {
    perRow = data.length < 2 ? 1 : 2;
  }

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: perRow,
    slidesToScroll: perRow,
    initialSlide: 0,
    responsive: [
      // {
      //   breakpoint: 1024,
      //   settings: {
      //     slidesToShow: perRow < 3 ? perRow : 3,
      //     slidesToScroll: perRow < 3 ? perRow : 3,
      //     infinite: true,
      //     dots: true,
      //   },
      // },
      // {
      //   breakpoint: 850,
      //   settings: {
      //     slidesToShow: perRow < 2 ? perRow : 2,
      //     slidesToScroll: perRow < 2 ? perRow : 2,
      //     initialSlide: 1,
      //   },
      // },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (data?.length === 0) {
    return (
      <>
        &nbsp;
        {' '}
        <h3 className="color-text">{title}</h3>
        <div className="text-card">
          <div className="edition-details">
            <h4 className="color-text card-title">
              There's nothing here,
              {' '}
              <Link to="/">Explore!</Link>
            </h4>
          </div>
        </div>
      </>

    );
  }

  return (
    <div>
      {type === 'edition' ? (
        <div>
          <h3 className="color-text">{title}</h3>
          <Slider {...settings} className="slider">
            {data.map((edition) => (
              <div key={edition.title}>
                <EditionCard details={edition} paid />
              </div>

            ))}
          </Slider>
        </div>
      ) : (type === 'owned-newsletters' ? (
        <div>
          <h3 className="color-text">{title}</h3>

          <Slider {...settings} className="slider">
            <div>
              <Link to="/create-newsletter" className="createNewsletter create-btn">
                <p>+ Create</p>
              </Link>
            </div>

            {data.map((edition) => (
              <ExploreCard newsletter={edition} newsletterId={edition.id} key={edition.title} />
            ))}
          </Slider>
        </div>
      )
        : (
          <div>
            <h3 className="color-text">{title}</h3>
            <Slider {...settings} className="slider">
              {data.map((edition) => (
                <ExploreCard newsletter={edition} newsletterId={edition.id} key={edition.title} />
              ))}
            </Slider>
          </div>
        )
      )}
    </div>

  );
}

export default DashboardRow;
