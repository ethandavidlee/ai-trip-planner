import React from 'react';
import { Link } from 'react-router-dom';

// Change the function names and links
// to fit your portfolio topic.

function GlobalNav() {
  return (
    <nav className='App-nav'>
        {/* Add links to Home, Topics, Gallery, Contact, and Staff Pages  */}
        <Link to="/">Home</Link>
        <Link to="/trip-planner">New Trip</Link>
        <Link to="/saved-trips">Saved Trips</Link>
    </nav>
  );
}

export default GlobalNav;
