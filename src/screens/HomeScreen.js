import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Calendar from '../components/Calendar';
import ScheduleList from '../components/ScheduleList';
import Announcement from '../components/Announcement';


const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState('2025-02-28');
  const [expandedItem, setExpandedItem] = useState(null);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView>
        <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
        <ScheduleList
          date={selectedDate}
          expandedItem={expandedItem}
          onToggleExpand={setExpandedItem}
        />
        <Announcement />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});

export default HomeScreen;
