import React from 'react';
import Trip from './Trip';

function TripList({ trips, onView, onDelete, onEdit }) {
    return (
        <table id="trips">
            {/* <caption>Tips</caption> */}
            <thead>
                <tr>
                    <th>Country</th>
                    <th>Arrival Date</th>
                    <th>Departure Date</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {trips.map(trip => 
                    <Trip 
                        trip={trip} 
                        key={trip._id}
                        onView={onView}
                        onDelete={onDelete}
                        onEdit={onEdit} 
                    />)}
            </tbody>
        </table>
    );
}

export default TripList;
