import './App.css';
import React, { useState } from 'react';
import EventForm from './components/EventForm/EventForm';
import EventList from './components/EventList/EventList';
import EventTimeline from './components/EventTimeline/EventTimeline';

function App() {
  const [showEventForm, setShowEventForm] = useState(false);
  const [view, setView] = useState('eventList');

  const handleCloseEventForm = () => {
    setShowEventForm(false);
  };

  const handleViewChange = () => {
    setView(prevView => (prevView === 'eventTimeline' ? 'eventList' : 'eventTimeline'));
  };

  const refreshEventList = () => {
    setShowEventForm(false); 
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Event Scheduler</h1>
        <div>
          <button onClick={() => setShowEventForm(true)}>Create Event</button>
          <button onClick={handleViewChange}>View {view === 'eventTimeline' ? 'Events' : 'Timeline'}</button>
        </div>
      </div>
      <div className="content-container">
        {showEventForm && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleCloseEventForm}>&times;</span>
              <EventForm onClose={handleCloseEventForm} onEventCreated={refreshEventList} />
            </div>
          </div>
        )}
        {view === 'eventTimeline' ? <EventTimeline  refreshKey={showEventForm}/> : <EventList refreshKey={showEventForm} />}
      </div>
    </div>
  );
}

export default App;
