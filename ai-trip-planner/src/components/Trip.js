import React from 'react';
import { MdDeleteSweep, MdOutlineEditNote } from 'react-icons/md';


function Trip({ trip, onView, onEdit, onDelete }) {
    return (
        <tr>
            <td onClick={() => onView(trip._id)}>{trip.country}</td>
            <td className="date">{trip.startDate.slice(0,10)}</td>
            <td className="date">{trip.endDate.slice(0,10)}</td>

            <td><MdOutlineEditNote onClick={() => onEdit(trip)} /></td>
            <td><MdDeleteSweep onClick={() => onDelete(trip._id)} /></td>
        </tr>
    );
}

export default Trip;
