import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function StudentProfile() {
  const events = [
    { id: '1', title: 'Reunião de Pais', date: '04-10-2005' },
    { id: '2', title: 'Feriado', date: '04-10-2025' },
    { id: '3', title: 'Dia dos Pais', date: '04-10-2025' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" onPress={() => navigation.navigate('Home')} />
      </TouchableOpacity>

      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2017/07/Sir-Ian-McKellen-as-Gandalf-The-Grey-The-Shire-Lord-of-the-Rings-Peter-Jackson.jpg' }} // Substitua pela URL da imagem real
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Lucas Oliveira</Text>
        <Text style={styles.profileDetails}>Turma: 2A</Text>
        <Text style={styles.profileDetails}>Professora: Ana Silva | Modalidade: Integral</Text>
      </View>

      {/* Diário Button */}
      <TouchableOpacity style={styles.diaryButton}>
        <Text style={styles.diaryButtonText}>Diário</Text>
      </TouchableOpacity>

      {/* Events List */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.eventItem}>
            <View style={styles.eventLeft}>
              <Ionicons name="calendar-outline" size={24} color="gray" />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventDate}>{item.date}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="gray" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 10,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileDetails: {
    fontSize: 14,
    color: 'gray',
  },
  diaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  diaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  eventLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDate: {
    fontSize: 14,
    color: 'gray',
  },
});