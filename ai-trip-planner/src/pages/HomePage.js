import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  // Define the planTrip function
  const planTrip = () => {
    // Navigate to the trip planner page
    navigate('/trip-planner');
  };

  return (
    <>
      <h2>Welcome</h2>

      <article>
        <p>Start planning your next trip with Jetlagged Adventures' AI-powered trip planner.</p>
        <p>Click the button below and enter your destination, travel dates, trip interests, and budget to get the perfect itinerary for your next adventure.</p>
      </article>

      <button type="button" onClick={planTrip} id="enter">
        Plan Trip
      </button>
    </>
  );
}

export default HomePage;
