import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CustomCalendar = ({ selectedDate, onDateChange }) => (
  <View style={styles.container}>
    <Text style={styles.heading}>Calendário:
      
    </Text>
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
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1e3a8a',
    marginBottom: 8,
  },
});

export default CustomCalendar;