import React, { useState, useEffect } from 'react';
import './EventFormUpdate.css';

const URL = "http://localhost:4000";

const EventFormUpdate = ({ eventId, onClose, onEventUpdated }) => {
  const [eventData, setEventData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    type: '',
  });

  useEffect(() => {
    fetch(`${URL}/events/${eventId}`)
      .then(response => response.json())
      .then(data => setEventData(data))
      .catch(error => console.error('Error fetching event data:', error));
  }, [eventId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setEventData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) {
        throw new Error('Failed to update event');
      }
      onEventUpdated(); 
      onClose();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  return (
    <div className="event-form-container">
      <h3 className='event-form-title'>Edit Event</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Event Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={eventData.startDate}
            onChange={handleChange}
            required
          />
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={eventData.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            name="type"
            value={eventData.type}
            onChange={handleChange}
            required
          >
            <option value="">Select Type</option>
            <option value="meeting">Meeting</option>
            <option value="project">Project</option>
            <option value="tournament">Tournament</option>
            <option value="merger">Merger</option>
            <option value="dividends">Dividends</option>
            <option value="hire">Hire</option>
            <option value="newcapital">New Capital</option>
            <option value="convention">Convention</option>
            <option value="social">Social</option>
            <option value="academicsemester">Academic Semester</option>
            <option value="holiday">Holiday</option>
            <option value="campaign">Campaign</option>
          </select>
        </div>
        <div className="button-container">
          <button type="submit">Update</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EventFormUpdate;
