const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const EVENTS_FILE_PATH = path.join(__dirname, 'events.json');

app.use(cors());
app.use(express.json());

const readEventsFromFile = () => {
    const eventsData = fs.readFileSync(EVENTS_FILE_PATH);
    return JSON.parse(eventsData);
};

const writeEventsToFile = (events) => {
    fs.writeFileSync(EVENTS_FILE_PATH, JSON.stringify(events, null, 2));
};

// ----------------Routes--------------------

// Get all events
app.get('/events', (req, res) => {
    const events = readEventsFromFile();
    res.json(events);
});

// Get event by ID
app.get('/events/:eventId', (req, res) => {
    const eventId = req.params.eventId;
    const events = readEventsFromFile();
    const event = events.find(event => event.id === eventId);
    if (event) {
        res.json(event);
    } else {
        res.status(404).json({ error: 'Event not found' });
    }
});

// Add a new event
app.post('/events', (req, res) => {
    const events = readEventsFromFile();
    const newEvent = req.body;
    events.push(newEvent);
    writeEventsToFile(events);
    res.status(201).json(newEvent);
});

// Update an event
app.put('/events/:eventId', (req, res) => {
    const eventId = req.params.eventId;
    const events = readEventsFromFile();
    const updatedEvent = req.body;
    const index = events.findIndex(event => event.id === eventId);
    if (index !== -1) {
        events[index] = { ...events[index], ...updatedEvent };
        writeEventsToFile(events);
        res.json(events[index]);
    } else {
        res.status(404).json({ error: 'Event not found' });
    }
});

// Delete an event
app.delete('/events/:eventId', (req, res) => {
    const eventId = req.params.eventId;
    const events = readEventsFromFile();
    const index = events.findIndex(event => event.id === eventId);
    if (index !== -1) {
        const deletedEvent = events.splice(index, 1);
        writeEventsToFile(events);
        res.json(deletedEvent);
    } else {
        res.status(404).json({ error: 'Event not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
