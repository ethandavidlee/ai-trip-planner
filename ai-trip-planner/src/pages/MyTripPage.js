import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function MyTripPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);

  // Fetch the trip details when the component mounts
  useEffect(() => {
    const fetchTripDetails = async () => {
      const tripID = location.state?.id;
      if (tripID) {
        try {
          const response = await fetch(`http://localhost:3000/trips/${tripID}`);
          if (response.ok) {
            const tripData = await response.json();
            setTrip(tripData);
          } else {
            alert(`Failed to fetch trip details. Status code: ${response.status}`);
          }
        } catch (error) {
          console.error('Fetch error:', error);
          alert(`An error occurred: ${error.message}`);
        }
      } else {
        alert('No trip ID found in state.');
      }
    };

    fetchTripDetails();
  }, [location.state]);

  // Define the planTrip function
  const editTrip = () => {
    navigate('/trip-planner', { state: trip });
  };

  return (
    <>
      <h2>Your Trip to {trip?.country || '[ERORR: Destination not retrieved]'}</h2>

      <article>

        {/* <p><strong>Country:</strong> {trip?.country}</p>
        <p><strong>Start Date:</strong> {trip?.startDate.slice(0,10)}</p>
        <p><strong>End Date:</strong> {trip?.endDate.slice(0,10)}</p>
        <p><strong>Trip Type:</strong> {trip?.tripType}</p> */}
         <p><strong>Check out your custom itinerary below.</strong></p>
        {trip?.itinerary && (
          <div dangerouslySetInnerHTML={{ __html: trip.itinerary.replace(/\n/g, '<br/>') }} />
        )}

      </article>

      <button type="button" onClick={editTrip} id="enter">
        Edit
        {/*Go to Plan Trip Page with user data already filled in*/}
      </button>
    </>
  );
}

export default MyTripPage;
