import React, { useEffect, useState } from 'react';
import EventFormUpdate from '../EventFormUpdate/EventFormUpdate';
import './EventList.css';

const URL = "http://localhost:4000";

const EventList = ({ refreshKey }) => {
  const [events, setEvents] = useState([]);
  
  const [editEventId, setEditEventId] = useState(null);

  const openEditModal = (eventId) => {
    setEditEventId(eventId);
  };

  const closeEditModal = () => {
    setEditEventId(null); 
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(URL + '/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [refreshKey]);

  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(`${URL}/events/${eventId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const fetchEventById = async (eventId) => {
    try {
      const response = await fetch(`${URL}/events/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }
      const eventData = await response.json();
      console.log('Fetched event:', eventData);
    } catch (error) {
      console.error('Error fetching event:', error);
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
              <td>{event.startDate}</td>
              <td>{event.endDate}</td>
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
            <EventFormUpdate eventId={editEventId} onClose={closeEditModal} onEventUpdated={fetchEvents}/>
        </div>
      </div>}
    </div>
  );
};

export default EventList;
