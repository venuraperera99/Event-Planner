import React, { useEffect, useState } from 'react';
import { Scheduler } from "@bitnoi.se/react-scheduler";
import './EventTimeline.css'; 
import "@bitnoi.se/react-scheduler/dist/style.css";

const URL = "http://localhost:4000";

const eventTypeColors = {
  Meeting: "Blue",
  Project: "Green",
  Tournament: "Yellow",
  Merger: "Gray",
  Dividends: "Gold",
  Hire: "Navy Blue",
  "New Capital": "Mint Green",
  Convention: "Purple",
  Social: "Pink",
  "Academic Semester": "Orange",
  Holiday: "Red",
  Campaign: "Cyan",
};

const EventTimeline = ({ refreshKey }) => {
  const [filterButtonState, setFilterButtonState] = useState(0);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, [refreshKey]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(URL + '/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      const eventsWithProps = data.map(event => ({
        ...event,
        bgColor: eventTypeColors[event.type] || "black",
        subtitle: event.type 
      }));
      setEvents(eventsWithProps);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const schedulerData = [
    {
      id: "070ac5b5-8369-4cd2-8ba2-0a209130cc60",
      label: {
        icon: "https://picsum.photos/24",
        title: "Venura Perera",
        subtitle: "Events for Venura"
      },
      data: events
    }
  ];
  
  return (
    <div className="eventtimeline-container">
      
      <Scheduler
        data={schedulerData}
        isLoading={false}
        onRangeChange={(newRange) => console.log(newRange)}
        onTileClick={(clickedResource) => console.log(clickedResource)}
        onItemClick={(item) => console.log(item)}
        onFilterData={() => {
          setFilterButtonState(1);
        }}
        onClearFilterData={() => {
          setFilterButtonState(0)
        }}
        config={{
          zoom: 0,
          filterButtonState,
        }}
      />

    </div>
  );
};

export default EventTimeline;
