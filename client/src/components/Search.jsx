import React from 'react';

function Search() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('submitted');
    // TODO: Post request to db
  };

  return (
    <section id="search">
      <form>
        <input id="searchbar" type="search" placeholder="Search" />
        <button type="submit" onSubmit={handleSubmit}>Search</button>
      </form>
    </section>
  );
}

export default Search;
