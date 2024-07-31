import React from 'react';
import { Link } from 'react-router-dom';


function GlobalNav() {
  return (
    <nav className='App-nav'>
        <Link to="/">Home</Link>
        <Link to="/trip-planner">New Trip</Link>
        <Link to="/saved-trips">Saved Trips</Link>
    </nav>
  );
}

export default GlobalNav;
