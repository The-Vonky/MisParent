import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

const mockSchedule = {
  '2025-02-28': [
    { id: '1', title: 'Matemática', time: '08:00 - 09:40', teacher: 'Prof. Ana' },
    { id: '2', title: 'História', time: '10:00 - 11:40', teacher: 'Prof. Carlos' },
  ],
  '2025-03-01': [
    { id: '1', title: 'Química', time: '08:00 - 09:40', teacher: 'Prof. João' },
  ],
};

const ScheduleList = ({ date, expandedItem, onToggleExpand }) => {
  const data = mockSchedule[date] || [];

  const handlePress = (id) => {
    onToggleExpand(expandedItem === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Aulas do Dia</Text>
      {data.length === 0 ? (
        <Text style={styles.empty}>Nenhuma aula cadastrada.</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isExpanded = expandedItem === item.id;
            return (
              <TouchableOpacity
                onPress={() => handlePress(item.id)}
                style={styles.card}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.title}>{item.title}</Text>
                  {isExpanded ? (
                    <ChevronUp color="#1e3a8a" size={20} />
                  ) : (
                    <ChevronDown color="#1e3a8a" size={20} />
                  )}
                </View>
                <Text style={styles.time}>{item.time}</Text>
                {isExpanded && (
                  <View style={styles.details}>
                    <Text style={styles.detailText}>Professor: {item.teacher}</Text>
                    <Text style={styles.detailText}>Sala: 203</Text>
                    <Text style={styles.detailText}>Conteúdo: Revisão</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1e293b',
  },
  empty: {
    fontStyle: 'italic',
    color: '#64748b',
  },
  card: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
  },
  time: {
    fontSize: 14,
    color: '#334155',
    marginTop: 4,
  },
  details: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#475569',
  },
});

export default ScheduleList;