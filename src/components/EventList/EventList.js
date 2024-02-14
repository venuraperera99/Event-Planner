import React, { useEffect, useState } from 'react';
import EventForm from '../EventForm/EventForm';
import './EventList.css';
import { formatDate } from '../../utils/utils';
import { API_URL } from '../../utils/constants';


const EventList = ({ refreshKey }) => {
  const [events, setEvents] = useState([]);
  const [editEventId, setEditEventId] = useState(null);

  useEffect(() => {
    fetchEventData();
  }, [refreshKey]);

  const openEditModal = (eventId) => {
    setEditEventId(eventId);
  };

  const closeEditModal = () => {
    setEditEventId(null); 
  };

  const fetchEventData = async () => {
    try {
      const response = await fetch(API_URL + '/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
      fetchEventData();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };


  return (
    <div className="event-list-container">
      <h2>Event List</h2>
      <table className="event-list-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Type</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{formatDate(new Date(event.startDate))}</td>
              <td>{formatDate(new Date(event.endDate))}</td>
              <td>{event.type}</td>
              <td><button onClick={() => openEditModal(event.id)}>Edit</button></td>
              <td><button onClick={() => deleteEvent(event.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {editEventId && 
       <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeEditModal}>&times;</span>
            <EventForm eventId={editEventId} onClose={closeEditModal} onEventUpdated={fetchEventData}/>
        </div>
      </div>}
    </div>
  );
};

export default EventList;
