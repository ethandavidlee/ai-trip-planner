import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function PlanTripPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const trip = location.state || {}; // Get the state from location, or use an empty object if it doesn't exist

  // Initialize state with the passed trip data or defaults
  const [tripID] = useState(trip._id || '');
  const [country, setCountry] = useState(trip.country || '');
  const [startDate, setStartDate] = useState(trip.startDate ? trip.startDate.slice(0, 10) : '');
  const [endDate, setEndDate] = useState(trip.endDate ? trip.endDate.slice(0, 10) : '');
  const [tripType, setTripType] = useState(trip.tripType || '');
  const [itinerary] = useState(trip.itinerary || '');

  const saveTrip = async () => {
    const tripData = { country, startDate, endDate, tripType, itinerary };
    const method = tripID ? 'PUT' : 'POST';
    const url = tripID ? `http://localhost:3000/trips/${tripID}` : 'http://localhost:3000/trips';
  
    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify(tripData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const responseData = await response.json();
        const responseID = tripID ? responseData._id : responseData;

        alert(`Your trip to ${country} was successfully ${tripID ? 'updated' : 'added'}. We are now generating your itinerary. Please be patient and do not refresh the page.`);

        const itineraryResponse = await fetch('http://localhost:3000/plantrip', {
          method: 'POST',
          body: JSON.stringify({ id: responseID }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        alert(`Thank you for your patience. Your itinerary has been generated.`);

        if (itineraryResponse.ok) {
          navigate('/my-trip', { state: { id: responseID } });

        } else {
          const contentType = itineraryResponse.headers.get('content-type');
          if (contentType && contentType.indexOf('application/json') !== -1) {
            const errorData = await itineraryResponse.json();
            alert(`The itinerary could not be generated due to an error (status code ${itineraryResponse.status}). ${errorData.Error}`);
          } else {
            const errorText = await itineraryResponse.text();
            alert(`The itinerary could not be generated due to an error (status code ${itineraryResponse.status}). ${errorText}`);
          }
        }

      } else {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
          const errorData = await response.json();
          alert(`The trip could not be ${tripID ? 'updated' : 'added'} due to an error (status code ${response.status}). ${errorData.Error}`);
        } else {
          const errorText = await response.text();
          alert(`The trip could not be ${tripID ? 'updated' : 'added'} due to an error (status code ${response.status}). ${errorText}`);
        }
      }

    } catch (error) {
      console.error('Fetch error:', error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <>
      <h2>Plan Your Trip</h2>
      <article>
        <p>Where do you want to travel?</p>
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">Select a country</option>
          <option value="USA">USA</option>
          <option value="Canada">Canada</option>
          <option value="Mexico">Mexico</option>
          <option value="Japan">Japan</option>
          <option value="France">France</option>
          <option value="Taiwan">Taiwan</option>
          <option value="Vietnam">Vietnam</option>
          {/* Add more countries here */}
        </select>

        <p>Please select your dates.</p>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>

        <p>What kind of trip are you interested in?</p>
        <select value={tripType} onChange={(e) => setTripType(e.target.value)}>
          <option value="">Select an interest</option>
          <option value="Adventure">Adventure</option>
          <option value="Culture">Culture</option>
          <option value="Food">Food</option>
          <option value="History">History</option>
          <option value="Nature">Nature</option>
          <option value="Relaxation">Relaxation</option>
        </select>
      </article>

      <button type="button" onClick={saveTrip} id="enter">
        Submit
      </button>
    </>
  );
}

export default PlanTripPage;
