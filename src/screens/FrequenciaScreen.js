import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function FrequencyScreen({ route }) {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('mes'); // mes, bimestre, ano
  const [loading, setLoading] = useState(false);

  // Get student ID from route params if available
  const studentId = route?.params?.studentId;

  // Enhanced mock data with error handling
  const studentData = useMemo(() => ({
    id: studentId || '1',
    name: 'James Júnior',
    class: 'Maternal II',
    teacher: 'Ana Carolina',
    modality: 'Integral',
    avatar: 'https://www.pintarcolorir.com.br/wp-content/uploads/2015/04/Desenhos-para-colorir-de-alunos-01-172x159.jpg',
    phone: '+55 11 99999-9999',
    email: 'maria.eduarda@escola.com',
  }), [studentId]);

  // Mock frequency data
  const frequencyData = useMemo(() => ({
    currentMonth: {
      totalDays: 22,
      presentDays: 20,
      absentDays: 2,
      percentage: 90.9,
      tardiness: 1
    },
    currentBimester: {
      totalDays: 44,
      presentDays: 40,
      absentDays: 4,
      percentage: 90.9,
      tardiness: 2
    },
    currentYear: {
      totalDays: 180,
      presentDays: 165,
      absentDays: 15,
      percentage: 91.7,
      tardiness: 8
    },
    dailyRecords: [
      {
        id: '1',
        date: '2025-06-19',
        status: 'present',
        arrivalTime: '07:30',
        departureTime: '17:00',
        observations: '',
        activities: ['Matemática', 'Português', 'Recreio', 'Artes']
      },
      {
        id: '2',
        date: '2025-06-18',
        status: 'present',
        arrivalTime: '07:45',
        departureTime: '17:00',
        observations: 'Chegou 15 minutos atrasado',
        activities: ['Ciências', 'Educação Física', 'Recreio', 'Música']
      },
      {
        id: '3',
        date: '2025-06-17',
        status: 'absent',
        arrivalTime: '',
        departureTime: '',
        observations: 'Atestado médico apresentado',
        activities: []
      },
      {
        id: '4',
        date: '2025-06-16',
        status: 'present',
        arrivalTime: '07:30',
        departureTime: '17:00',
        observations: '',
        activities: ['Matemática', 'Português', 'Recreio', 'Literatura']
      },
      {
        id: '5',
        date: '2025-06-15',
        status: 'present',
        arrivalTime: '07:35',
        departureTime: '17:00',
        observations: '',
        activities: ['História', 'Geografia', 'Recreio', 'Inglês']
      },
      {
        id: '6',
        date: '2025-06-14',
        status: 'absent',
        arrivalTime: '',
        departureTime: '',
        observations: 'Falta justificada pelos pais',
        activities: []
      },
      {
        id: '7',
        date: '2025-06-13',
        status: 'present',
        arrivalTime: '07:30',
        departureTime: '17:00',
        observations: '',
        activities: ['Matemática', 'Artes', 'Recreio', 'Educação Física']
      },
    ]
  }), []);

  // Enhanced handlers
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Here you would fetch fresh data from your API
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar os dados');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleContactPress = useCallback(() => {
    Alert.alert(
      'Contato',
      `Telefone: ${studentData.phone}\nEmail: ${studentData.email}`,
      [
        { text: 'Fechar', style: 'cancel' },
        { text: 'Ligar', onPress: () => {/* Handle phone call */} },
        { text: 'Email', onPress: () => {/* Handle email */} }
      ]
    );
  }, [studentData]);

  const handleRecordPress = useCallback((record) => {
    const statusText = record.status === 'present' ? 'Presente' : 'Ausente';
    const timeInfo = record.status === 'present' 
      ? `Entrada: ${record.arrivalTime}\nSaída: ${record.departureTime}`
      : 'Não compareceu';
    
    const activitiesText = record.activities.length > 0 
      ? `\n\nAtividades: ${record.activities.join(', ')}`
      : '';
    
    const observationsText = record.observations 
      ? `\n\nObservações: ${record.observations}`
      : '';

    Alert.alert(
      `Frequência - ${formatDate(record.date)}`,
      `Status: ${statusText}\n${timeInfo}${activitiesText}${observationsText}`,
      [{ text: 'Fechar', style: 'cancel' }]
    );
  }, []);

  const handleJustifyAbsence = useCallback(() => {
    Alert.alert(
      'Justificar Falta',
      'Deseja enviar uma justificativa para as faltas do aluno?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Enviar', 
          onPress: () => {
            Alert.alert('Sucesso', 'Justificativa enviada para análise!');
          }
        },
      ]
    );
  }, []);

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return '#10b981';
      case 'absent': return '#ef4444';
      case 'late': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return 'checkmark-circle';
      case 'absent': return 'close-circle';
      case 'late': return 'time';
      default: return 'help-circle';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[date.getDay()];
  };

  const getFrequencyStats = () => {
    switch (selectedPeriod) {
      case 'mes': return frequencyData.currentMonth;
      case 'bimestre': return frequencyData.currentBimester;
      case 'ano': return frequencyData.currentYear;
      default: return frequencyData.currentMonth;
    }
  };

  const getPeriodText = () => {
    switch (selectedPeriod) {
      case 'mes': return 'Este Mês';
      case 'bimestre': return 'Este Bimestre';
      case 'ano': return 'Este Ano';
      default: return 'Este Mês';
    }
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 90) return '#10b981';
    if (percentage >= 75) return '#f59e0b';
    return '#ef4444';
  };

  // Render functions
  const renderFrequencyRecord = ({ item }) => {
    const isPresent = item.status === 'present';
    const hasObservations = item.observations && item.observations.length > 0;
    const isLate = item.observations && item.observations.includes('atrasado');

    return (
      <TouchableOpacity 
        style={styles.recordItem} 
        onPress={() => handleRecordPress(item)}
      >
        <View style={styles.dateContainer}>
          <Text style={styles.dayOfWeek}>{getDayOfWeek(item.date)}</Text>
          <Text style={styles.dateText}>{formatDateShort(item.date)}</Text>
        </View>
        
        <View style={styles.recordContent}>
          <View style={styles.recordHeader}>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(item.status) }
            ]}>
              <Ionicons 
                name={getStatusIcon(item.status)} 
                size={16} 
                color="white" 
              />
            </View>
            <Text style={[
              styles.statusText,
              { color: getStatusColor(item.status) }
            ]}>
              {isPresent ? 'Presente' : 'Ausente'}
            </Text>
            {isLate && (
              <View style={styles.lateIndicator}>
                <Ionicons name="time" size={12} color="#f59e0b" />
                <Text style={styles.lateText}>Atraso</Text>
              </View>
            )}
          </View>
          
          {isPresent && (
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                Entrada: {item.arrivalTime} • Saída: {item.departureTime}
              </Text>
            </View>
          )}
          
          {hasObservations && (
            <Text style={styles.observationsText} numberOfLines={2}>
              {item.observations}
            </Text>
          )}
          
          {item.activities.length > 0 && (
            <View style={styles.activitiesContainer}>
              <Text style={styles.activitiesLabel}>Atividades:</Text>
              <Text style={styles.activitiesText} numberOfLines={1}>
                {item.activities.join(' • ')}
              </Text>
            </View>
          )}
        </View>
        
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </TouchableOpacity>
    );
  };

  const currentStats = getFrequencyStats();

  return (
    <SafeAreaView style={styles.container}>
      {/* StatusBar with blue background and light text */}
      <StatusBar backgroundColor="#1e3a8a" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Frequência Escolar</Text>
        <TouchableOpacity style={styles.contactButton} onPress={handleContactPress}>
          <Ionicons name="call-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#1e3a8a']}
            tintColor="#1e3a8a"
          />
        }
      >
        {/* Profile Card */}
        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: studentData.avatar }}
              style={styles.profileImage}
              onError={() => {
                console.log('Failed to load profile image');
              }}
            />
            <View style={styles.onlineIndicator} />
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{studentData.name}</Text>
            <Text style={styles.profileClass}>Turma {studentData.class}</Text>
            <Text style={styles.profileTeacher}>Prof. {studentData.teacher} • {studentData.modality}</Text>
          </View>
        </View>

        {/* Period Selector */}
        <View style={styles.periodContainer}>
          <TouchableOpacity
            style={[styles.periodTab, selectedPeriod === 'mes' && styles.activePeriodTab]}
            onPress={() => setSelectedPeriod('mes')}
          >
            <Text style={[styles.periodText, selectedPeriod === 'mes' && styles.activePeriodText]}>
              Mês
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodTab, selectedPeriod === 'bimestre' && styles.activePeriodTab]}
            onPress={() => setSelectedPeriod('bimestre')}
          >
            <Text style={[styles.periodText, selectedPeriod === 'bimestre' && styles.activePeriodText]}>
              Bimestre
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodTab, selectedPeriod === 'ano' && styles.activePeriodTab]}
            onPress={() => setSelectedPeriod('ano')}
          >
            <Text style={[styles.periodText, selectedPeriod === 'ano' && styles.activePeriodText]}>
              Ano
            </Text>
          </TouchableOpacity>
        </View>

        {/* Frequency Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>{getPeriodText()}</Text>
            <View style={[
              styles.percentageBadge,
              { backgroundColor: getPercentageColor(currentStats.percentage) }
            ]}>
              <Text style={styles.percentageText}>{currentStats.percentage.toFixed(1)}%</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <View style={styles.statIconContainer}>
                <Ionicons name="calendar-outline" size={24} color="#1e3a8a" />
              </View>
              <Text style={styles.statValue}>{currentStats.totalDays}</Text>
              <Text style={styles.statLabel}>Total de Dias</Text>
            </View>
            
            <View style={styles.statBox}>
              <View style={[styles.statIconContainer, { backgroundColor: '#10b98120' }]}>
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              </View>
              <Text style={[styles.statValue, { color: '#10b981' }]}>{currentStats.presentDays}</Text>
              <Text style={styles.statLabel}>Presenças</Text>
            </View>
            
            <View style={styles.statBox}>
              <View style={[styles.statIconContainer, { backgroundColor: '#ef444420' }]}>
                <Ionicons name="close-circle" size={24} color="#ef4444" />
              </View>
              <Text style={[styles.statValue, { color: '#ef4444' }]}>{currentStats.absentDays}</Text>
              <Text style={styles.statLabel}>Faltas</Text>
            </View>
            
            <View style={styles.statBox}>
              <View style={[styles.statIconContainer, { backgroundColor: '#f59e0b20' }]}>
                <Ionicons name="time" size={24} color="#f59e0b" />
              </View>
              <Text style={[styles.statValue, { color: '#f59e0b' }]}>{currentStats.tardiness}</Text>
              <Text style={styles.statLabel}>Atrasos</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Frequência</Text>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                { 
                  width: `${currentStats.percentage}%`,
                  backgroundColor: getPercentageColor(currentStats.percentage)
                }
              ]} />
            </View>
            <Text style={styles.progressText}>
              {currentStats.presentDays} de {currentStats.totalDays} dias letivos
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => navigation.navigate('MessagesModal')}
            >
              <Ionicons name="chatbubbles-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Conversar com a Professora</Text>
            </TouchableOpacity>
            
            {currentStats.absentDays > 0 && (
              <TouchableOpacity 
                style={styles.justifyButton}
                onPress={handleJustifyAbsence}
              >
                <Ionicons name="document-text-outline" size={20} color="#f59e0b" />
                <Text style={styles.justifyButtonText}>Justificar Faltas</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Daily Records */}
        <View style={styles.recordsSection}>
          <View style={styles.recordsHeader}>
            <Text style={styles.recordsTitle}>Registro Diário</Text>
            <Text style={styles.recordsSubtitle}>Últimos 7 dias</Text>
          </View>
          
          <FlatList
            data={frequencyData.dailyRecords}
            renderItem={renderFrequencyRecord}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#1e3a8a',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contactButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  profileContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    marginRight: 16,
    position: 'relative',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#1e3a8a',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 2,
  },
  profileClass: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 2,
  },
  profileTeacher: {
    fontSize: 12,
    color: '#6b7280',
  },
  periodContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 20,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activePeriodTab: {
    backgroundColor: '#1e3a8a',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activePeriodText: {
    color: '#fff',
  },
  statsCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  percentageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  percentageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1e3a8a20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  actionButtons: {
    gap: 12,
  },
  button: {
    backgroundColor: '#1e3a8a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  justifyButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#f59e0b',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  justifyButtonText: {
    color: '#f59e0b',
    fontWeight: 'bold',
    fontSize: 16,
  },
  recordsSection: {
    margin: 20,
    marginTop: 0,
  },
  recordsHeader: {
    marginBottom: 16,
  },
  recordsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  recordsSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  recordItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateContainer: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 50,
  },
  dayOfWeek: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  recordContent: {
    flex: 1,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  lateIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  lateText: {
    fontSize: 10,
    color: '#92400e',
    marginLeft: 4,
    fontWeight: '600',
  },
  timeContainer: {
    marginBottom: 6,
  },
  timeText: {
    fontSize: 12,
    color: '#6b7280',
  },
  observationsText: {
    fontSize: 12,
    color: '#ef4444',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  activitiesContainer: {
    marginTop: 4,
  },
  activitiesLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 2,
  },
  activitiesText: {
    fontSize: 11,
    color: '#374151',
  },
});