import React from 'react';
import { Calendar } from 'react-native-calendars';


const CustomCalendar = ({ selectedDate, onDateChange }) => (
  <Calendar
    onDayPress={(day) => onDateChange(day.dateString)}
    markedDates={{
      [selectedDate]: {
        selected: true,
        marked: true,
        selectedColor: '#1e3a8a'
      }
    }}
    theme={{
      todayTextColor: '#1e3a8a',
      arrowColor: '#1e3a8a',
    }}
  />
);

export default Calendar;
