import React, { useId } from 'react';

function Search({ handleSearch }) {
  const searchId = useId();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(e.target.searchString.value);
  };

  return (
    <section className="search">
      <form type="submit" onSubmit={handleSubmit} htmlFor={searchId}>
        <input id={searchId} name="searchString" type="search" placeholder="Search" className="search-input" />
        <button type="submit" className="search-btn">Search</button>
      </form>
    </section>
  );
}

export default Search;
