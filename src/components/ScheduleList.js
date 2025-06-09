import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

const mockSchedule = {
  '2025-02-28': [
    { id: '1', title: 'Matemática', time: '08:00 - 09:40', teacher: 'Prof. Ana' },
    { id: '2', title: 'História', time: '10:00 - 11:40', teacher: 'Prof. Carlos' },
    { id: '3', title: 'Matemática', time: '08:00 - 09:40', teacher: 'Prof. Ana' },
    { id: '4', title: 'História', time: '10:00 - 11:40', teacher: 'Prof. Carlos' },
    { id: '5', title: 'Matemática', time: '08:00 - 09:40', teacher: 'Prof. Ana' },
    { id: '6', title: 'História', time: '10:00 - 11:40', teacher: 'Prof. Carlos' },
  ],
};

const ScheduleList = ({ date }) => {
  const [expandedItem, setExpandedItem] = useState(null);
  const [heights] = useState({});
  const [opacity] = useState({});

  const handlePress = (id) => {
    if (expandedItem === id) {
      Animated.parallel([
        Animated.timing(heights[id], {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(opacity[id], {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
      setExpandedItem(null);
    } else {
      if (expandedItem) {
        Animated.parallel([
          Animated.timing(heights[expandedItem], {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(opacity[expandedItem], {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }),
        ]).start();
      }

      setExpandedItem(id);
      Animated.parallel([
        Animated.timing(heights[id], {
          toValue: 60,
          duration: 280,
          useNativeDriver: false,
        }),
        Animated.timing(opacity[id], {
          toValue: 1,
          duration: 280,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedItem === item.id;

    if (!heights[item.id]) {
      heights[item.id] = new Animated.Value(0);
    }
    if (!opacity[item.id]) {
      opacity[item.id] = new Animated.Value(0);
    }

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
        <Animated.View
          style={[styles.details, { height: heights[item.id], opacity: opacity[item.id] }]}
        >
          {isExpanded && (
            <>
              <Text style={styles.detailText}>Professor: {item.teacher}</Text>
              <Text style={styles.detailText}>Sala: 203</Text>
              <Text style={styles.detailText}>Conteúdo: Revisão</Text>
            </>
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const data = mockSchedule[date] || [];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Aulas do Dia:</Text>
      {data.length === 0 ? (
        <Text style={styles.empty}>Nenhuma aula cadastrada.</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
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
    fontWeight: '500',
    color: '#1e3a8a',
    marginBottom: 15,
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
    overflow: 'hidden',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#475569',
  },
});

export default ScheduleList;
