import React, { useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Calendar from '../components/Calendar';
import ScheduleList from '../components/ScheduleList';
import Announcement from '../components/Announcement';

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState('2025-02-28');
  const [expandedItem, setExpandedItem] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <FlatList
        data={[]} // Lista vazia só pra ativar o scroll
        ListHeaderComponent={
          <View>
            <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
            <ScheduleList
              date={selectedDate}
              expandedItem={expandedItem}
              onToggleExpand={setExpandedItem}
            />
            <Announcement />
          </View>
        }
        keyExtractor={() => 'dummy'} // necessário mesmo com lista vazia
        renderItem={null} // sem itens reais
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default HomeScreen;