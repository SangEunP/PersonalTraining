import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import './Calendar.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch training events from the API
    axios.get('https://traineeapp.azurewebsites.net/gettrainings')
      .then((response) => {
        const formattedEvents = response.data.map(event => ({
          title: `${event.customer.firstname} ${event.customer.lastname} - ${event.activity}`,
          start: new Date(event.date), // Use the appropriate field for the start date
          end: moment(event.date).add(event.duration, 'minutes').toDate(), // Calculate the end date based on duration
          trainingInfo: event, // Store the entire training info
        }));
        setEvents(formattedEvents);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  }, []);

  return (
    <div className="calendar-container">
      <h2>Training Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={event => {
          alert(
            `Training Info:\nDate: ${moment(event.trainingInfo.date).format('LLL')}\nTime: ${moment(
              event.trainingInfo.date
            ).format('LT')}\nActivity: ${event.trainingInfo.activity}\nCustomer: ${event.trainingInfo.customer.firstname} ${event.trainingInfo.customer.lastname}`
          );
        }}
      />
    </div>
  );
};

export default CalendarPage;