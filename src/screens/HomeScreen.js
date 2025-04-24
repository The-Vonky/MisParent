import React, { useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Calendar from '../components/Calendar';
import ScheduleList from '../components/ScheduleList';
import Announcement from '../components/Announcement';
import Divider from '../components/Divider';

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState('2025-02-28');
  const [expandedItem, setExpandedItem] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <FlatList
        data={[]} // Lista vazia só pra ativar o scroll
        ListHeaderComponent={
          <View style={styles.content}>
            <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
            <Divider />

            <ScheduleList
              date={selectedDate}
              expandedItem={expandedItem}
              onToggleExpand={setExpandedItem}
            />
            <Divider />

            <Announcement />
            <Divider />
          </View>
        }
        keyExtractor={() => 'dummy'}
        renderItem={null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingBottom: 24,
  },
});

export default HomeScreen;