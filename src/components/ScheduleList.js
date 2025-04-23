import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const mockData = {
  '2025-02-28': [
    { id: 1, title: 'Conteúdos de Aprendizagem', time: '14:30 - 14:30', details: 'Eletromagnetismo, Termologia...' },
    { id: 2, title: 'Contação de Histórias', time: '14:30 - 14:55' },
    // outros itens...
  ]
};

const ScheduleList = ({ date, expandedItem, onToggleExpand }) => {
  const schedules = mockData[date] || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Horários</Text>
      {schedules.map(item => (
        <View key={item.id} style={styles.card}>
          <TouchableOpacity onPress={() => onToggleExpand(expandedItem === item.id ? null : item.id)}>
            <Text style={styles.cardTitle}>{item.title}  {item.time}</Text>
          </TouchableOpacity>
          {expandedItem === item.id && item.details && (
            <View style={styles.details}>
              <Text>{item.details}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  card: { backgroundColor: '#f97316', marginBottom: 8, borderRadius: 8, padding: 10 },
  cardTitle: { color: '#fff', fontWeight: '600' },
  details: { backgroundColor: '#fff', padding: 10, borderRadius: 6, marginTop: 4 }
});

export default ScheduleList;
