import React from 'react';

function EditionList({ editions }) {
  console.log(editions)

  return (
    <div>
      {editions.map((edition) => (
        edition.title
      ))}
    </div>
  );
}

export default EditionList;
