import React from 'react';
import EditionCard from './EditionCard';

function EditionList({ editions }) {

  return (
    <>
      {editions.map((edition) => (
        <EditionCard details={edition} key={edition.title} />
      ))}
    </>
  );
}

export default EditionList;
