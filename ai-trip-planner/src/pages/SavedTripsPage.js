import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TripList from '../components/TripList';
import ConfirmationModal from '../components/ConfirmationModal';

function SavedTripsPage({ setTrip }) {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tripToDelete, setTripToDelete] = useState(null);

    const loadTrips = async () => {
        try {
            const response = await fetch('http://localhost:3000/trips/');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const trips = await response.json();
            console.log('Trips data:', trips);
            setTrips(trips);
        } catch (error) {
            console.error('Failed to fetch trips:', error);
        }
    };

    const onViewTrip = async _id => {
        navigate('/my-trip', { state: { id: _id } });
    };

    const onEditTrip = async trip => {
      navigate('/trip-planner', { state: trip });
      };

    const onDeleteTrip = _id => {
      setTripToDelete(_id);
      setIsModalOpen(true);
  };

    const handleConfirmDelete = async () => {
        if (tripToDelete) {
            try {
                const response = await fetch(`http://localhost:3000/trips/${tripToDelete}`, { method: 'DELETE' });
                if (response.ok) {
                    loadTrips();
                } else {
                    console.error(`Failed to delete trip with ID ${tripToDelete}, status: ${response.status}`);
                }
            } catch (error) {
                console.error(`Failed to delete trip with ID ${tripToDelete}, error: ${error}`);
            }
        }
        setIsModalOpen(false);
        setTripToDelete(null);
    };

    const handleCancelDelete = () => {
      setIsModalOpen(false);
      setTripToDelete(null);
  };

    useEffect(() => {
        loadTrips();
    }, []);

    return (
        <>
            <h2>Your Saved Trips</h2>
            <p>Here you can view your trips' itineraries by clicking the country name. You can also edit or delete a trip by clicking the corresponding icons.</p>
            {trips.length === 0 ? (
                <p>No trips available</p>
            ) : (
                <TripList 
                    trips={trips}
                    onView={onViewTrip} 
                    onEdit={onEditTrip} 
                    onDelete={onDeleteTrip} 
                />
            )}
             <ConfirmationModal 
                isOpen={isModalOpen}
                message="Are you sure you want to delete this trip?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </>
    );
}

export default SavedTripsPage;
