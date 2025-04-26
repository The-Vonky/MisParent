// src/screens/HomeScreen.js
import React, { useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Calendar from '../components/Calendar';
import ScheduleList from '../components/ScheduleList';
import Announcement from '../components/Announcement';
import Divider from '../components/Divider';
import ProfileMenu from '../components/ProfileMenu';
import { ScrollView } from 'react-native';

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState('2025-02-28');
  const [expandedItem, setExpandedItem] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Header onProfilePress={() => setMenuVisible(true)} />
      <ProfileMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />

      <FlatList
        data={[]}
        ListHeaderComponent={
          <View>
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
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
            </ScrollView>
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
});

export default HomeScreen;
