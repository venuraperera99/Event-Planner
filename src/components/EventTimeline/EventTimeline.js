import React from 'react';
import './EventTimeline.css';

const EventTimeline = () => {
  // Mock data for event timeline
  const events = [
    { id: 1, title: 'Meeting', startDate: '2024-02-20', endDate: '2024-02-20', type: 'Business' },
    { id: 2, title: 'Presentation', startDate: '2024-02-22', endDate: '2024-02-23', type: 'Business' },
    { id: 3, title: 'Birthday Party', startDate: '2024-02-25', endDate: '2024-02-25', type: 'Social' }
  ];

  return (
    <div>
      <h2>Event Timeline</h2>
      <div className="timeline">
        {events.map(event => (
          <div key={event.id} className="event">
            <div className="event-title">{event.title}</div>
            <div className="event-dates">{event.startDate} - {event.endDate}</div>
            <div className="event-type">{event.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventTimeline;
