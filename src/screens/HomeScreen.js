import { useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Calendar from '../components/Calendar';
import ScheduleList from '../components/ScheduleList';
import Announcement from '../components/Announcement';
import Divider from '../components/Divider';
import ProfileMenu from '../components/ProfileMenu';
import MessagesModal from '../components/MessagesModal';
import NotificationModal from '../components/NotificationModal';


const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState('2025-02-28');
  const [expandedItem, setExpandedItem] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [messagesVisible, setMessagesVisible] = useState(false);
  const [dailyReport, setDailyReport] = useState(null);

  const handleProfilePress = () => setMenuVisible(true);
  const handleNotificationPress = () => setNotificationsVisible(true);
  const handleMessagePress = () => setMessagesVisible(true);

  const handleSaveReport = (report) => {
    setDailyReport(report);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onProfilePress={handleProfilePress}
        onNotificationPress={handleNotificationPress}
        onMessagePress={handleMessagePress}
      />

      <ProfileMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
      <NotificationModal visible={notificationsVisible} onClose={() => setNotificationsVisible(false)} />
      <MessagesModal visible={messagesVisible} onClose={() => setMessagesVisible(false)} />

      <FlatList
        data={[]}
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
        keyExtractor={(item, index) => index.toString()}
        renderItem={null}
        showsVerticalScrollIndicator={false}
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
  noReport: {
    fontSize: 18,
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;
