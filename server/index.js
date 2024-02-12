// server/index.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const EVENTS_FILE_PATH = path.join(__dirname, 'events.json');

// Helper function to read event data from JSON file
const readEventsFromFile = () => {
  const eventsData = fs.readFileSync(EVENTS_FILE_PATH);
  return JSON.parse(eventsData);
};

// Helper function to write event data to JSON file
const writeEventsToFile = (events) => {
  fs.writeFileSync(EVENTS_FILE_PATH, JSON.stringify(events, null, 2));
};

// Validation middleware for event data
const validateEventData = [
  body('title').notEmpty().withMessage('Title cannot be empty').isString().withMessage('Title must be a string'),
  body('startDate').notEmpty().withMessage('Start date cannot be empty').isDate().withMessage('Start date must be a valid date'),
  body('endDate').notEmpty().withMessage('End date cannot be empty').isDate().withMessage('End date must be a valid date'),
  body('type').notEmpty().withMessage('Type cannot be empty').isString().withMessage('Type must be a string'),
];

// Get all events
app.get('/events', (req, res) => {
  const events = readEventsFromFile();
  res.json(events);
});

// Add a new event
app.post('/events', validateEventData, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const events = readEventsFromFile();
  const newEvent = req.body;
  events.push(newEvent);
  writeEventsToFile(events);
  res.status(201).json(newEvent);
});

// Update an event
app.put('/events/:eventId', validateEventData, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
