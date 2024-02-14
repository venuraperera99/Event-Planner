import React, { useEffect, useState } from 'react';
import { Scheduler } from "@bitnoi.se/react-scheduler";
import './EventTimeline.css';
import "@bitnoi.se/react-scheduler/dist/style.css";
import { API_URL, EVENT_TYPE_COLORS } from '../../utils/constants';


const EventTimeline = ({ refreshKey }) => {
  const [filterButtonState, setFilterButtonState] = useState(0);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEventData();
  }, [refreshKey]);

  const fetchEventData = async () => {
    try {
      const response = await fetch(API_URL + '/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      const eventsWithProps = data.map(event => ({
        ...event,
        bgColor: EVENT_TYPE_COLORS[event.type] || "black",
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
