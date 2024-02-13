import React, { useState } from 'react';
import './EventForm.css';

const URL = "http://localhost:4000";

const EventForm = ({ onClose, onEventCreated  }) => {
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    type: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = generateRandomId();
    const newEvent = { id, ...formData };
    try {
      const response = await fetch(URL + '/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });
      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      onEventCreated();
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 11); // Generates a random alphanumeric string
  };

  return (
    <div className="event-form-container">
      <h3 className='event-form-title'>Add Event</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Event Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
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
            value={formData.startDate}
            onChange={handleChange}
            required
          />
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            name="type"
            value={formData.type}
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
          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
