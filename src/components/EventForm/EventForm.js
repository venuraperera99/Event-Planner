import React, { useEffect } from 'react';
import './EventForm.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const URL = "http://localhost:4000";
let requestData;

const EventForm = ({ onClose, onEventCreated, eventId, onEventUpdated }) => {
  const isUpdateForm = eventId !== undefined;

  useEffect(() => {
    if (isUpdateForm) {
      fetch(`${URL}/events/${eventId}`)
        .then(response => response.json())
        .then(data => {
          data.startDate = formatDate(new Date(data.startDate));
          data.endDate = formatDate(new Date(data.endDate));
          formik.setValues(data);
        })
        .catch(error => console.error('Error fetching event data:', error));
    }
  }, [eventId, isUpdateForm]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date()
      .required('End date is required')
      .min(Yup.ref('startDate'), 'End date must be after start date'),
    type: Yup.string().required('Type is required').notOneOf([''], 'Please select a type'),
  });

  const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 11);
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      startDate: '',
      endDate: '',
      type: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const url = isUpdateForm ? `${URL}/events/${eventId}` : `${URL}/events`;
        const method = isUpdateForm ? 'PUT' : 'POST';

        const startDate = new Date(values.startDate);
        const endDate = new Date(values.endDate);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          throw new Error('Invalid date format');
        }

        if (isUpdateForm) {
          requestData = values;
        } else {
          const id = generateRandomId(); // Generate a random ID
          requestData = { id, ...values, startDate, endDate };
        }

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error(isUpdateForm ? 'Failed to update event' : 'Failed to create event');
        }

        if (isUpdateForm) {
          onEventUpdated();
        } else {
          onEventCreated();
        }

        onClose();
      } catch (error) {
        console.error(`Error ${isUpdateForm ? 'updating' : 'creating'} event:`, error);
      }
    },
  });

  // Function to format date to display only date part
  const formatDate = (date) => {
    return date.toISOString().split('T')[0]; // Get only the date part
  };

  return (
    <div className="event-form-container">
      <h3 className='event-form-title'>{isUpdateForm ? 'Edit Event' : 'Add Event'}</h3>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="title">Event Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.title && formik.errors.title ? (
            <div className="error-message">{formik.errors.title}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formik.values.startDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.startDate && formik.errors.startDate ? (
            <div className="error-message">{formik.errors.startDate}</div>
          ) : null}
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formik.values.endDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.endDate && formik.errors.endDate ? (
            <div className="error-message">{formik.errors.endDate}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          >
            <option value="">Select Type</option>
            <option value="Meeting">Meeting</option>
            <option value="Project">Project</option>
            <option value="Tournament">Tournament</option>
            <option value="Merger">Merger</option>
            <option value="Dividends">Dividends</option>
            <option value="Hire">Hire</option>
            <option value="New Capital">New Capital</option>
            <option value="Convention">Convention</option>
            <option value="Social">Social</option>
            <option value="Academic Semester">Academic Semester</option>
            <option value="Holiday">Holiday</option>
            <option value="Campaign">Campaign</option>
          </select>
          {formik.touched.type && formik.errors.type ? (
            <div className="error-message">{formik.errors.type}</div>
          ) : null}
        </div>
        <div className="button-container">
          <button type="submit">{isUpdateForm ? 'Update' : 'Submit'}</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
