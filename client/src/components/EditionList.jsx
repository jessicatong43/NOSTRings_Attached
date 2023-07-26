import React from 'react';

function EditionList({ editions }) {

  return (
      <ul>
        editions.map((edition) => (
          <li>edition.title</li>
        ))

      </ul>
  );
}

export default EditionList;
