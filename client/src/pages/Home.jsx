import React, { useState } from 'react';
import Search from '../components/Search';
import Explore from './Explore';

function Main() {
  return (
    <div>
      Main Page
      <Search />
      <Explore />
    </div>
  );
}

export default Main;
