import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function AdminDashboard() {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState('');
  const [greeting, setGreeting] = useState('');

  // Dados mockados - em produção viriam do Firebase
  const [dashboardData, setDashboardData] = useState({
    studentsPresent: 85,
    totalStudents: 92,
    pendingReports: 12,
    newMessages: 5,
    lowStockItems: 3,
    scheduledMeetings: 2,
  });

  const [recentAlerts, setRecentAlerts] = useState([
    {
      id: 1,
      type: 'material',
      title: 'Falta de fraldas',
      student: 'Ana Clara - Turma A',
      time: '2h atrás',
      priority: 'high'
    },
    {
      id: 2,
      type: 'meeting',
      title: 'Reunião agendada',
      student: 'Pais do João Pedro',
      time: '4h atrás',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'report',
      title: 'Relatório pendente',
      student: 'Maria Eduarda - Turma B',
      time: '1 dia atrás',
      priority: 'low'
    }
  ]);

  useEffect(() => {
    // Configurar data e saudação
    const now = new Date();
    const hour = now.getHours();
    const dateStr = now.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });

    setCurrentDate(dateStr);

    if (hour < 12) {
      setGreeting('Bom dia');
    } else if (hour < 18) {
      setGreeting('Boa tarde');
    } else {
      setGreeting('Boa noite');
    }
  }, []);

  const quickActions = [
    {
      id: 1,
      title: 'Relatório Diário',
      icon: 'document-text-outline',
      color: '#fb923c',
      screen: 'DailyReport'
    },
    {
      id: 2,
      title: 'Cadastrar Aluno',
      icon: 'person-add-outline',
      color: '#10b981',
      screen: 'RegisterStudent'
    },
    {
      id: 3,
      title: 'Mensagens',
      icon: 'chatbubble-outline',
      color: '#3b82f6',
      screen: 'Messages'
    },
    {
      id: 4,
      title: 'Plano de Aula',
      icon: 'book-outline',
      color: '#8b5cf6',
      screen: 'LessonPlan'
    },
    {
      id: 5,
      title: 'Alertas',
      icon: 'notifications-outline',
      color: '#ef4444',
      screen: 'Alerts'
    },
    {
      id: 6,
      title: 'Configurações',
      icon: 'settings-outline',
      color: '#6b7280',
      screen: 'Settings'
    }
  ];

  const StatCard = ({ title, value, subtitle, icon, color, onPress }) => (
    <TouchableOpacity style={[styles.statCard, { borderLeftColor: color }]} onPress={onPress}>
      <View style={styles.statContent}>
        <View style={styles.statTextContainer}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
          {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        </View>
        <View style={[styles.statIconContainer, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const QuickActionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.quickActionItem}
      onPress={() => navigation.navigate(item.screen)}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: item.color + '15' }]}>
        <Ionicons name={item.icon} size={24} color={item.color} />
      </View>
      <Text style={styles.quickActionText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const AlertItem = ({ item }) => {
    const getAlertIcon = () => {
      switch (item.type) {
        case 'material': return 'alert-circle';
        case 'meeting': return 'calendar';
        case 'report': return 'document-text';
        default: return 'information-circle';
      }
    };

    const getAlertColor = () => {
      switch (item.priority) {
        case 'high': return '#ef4444';
        case 'medium': return '#fb923c';
        case 'low': return '#6b7280';
        default: return '#6b7280';
      }
    };

    return (
      <View style={styles.alertItem}>
        <View style={[styles.alertIcon, { backgroundColor: getAlertColor() + '15' }]}>
          <Ionicons name={getAlertIcon()} size={18} color={getAlertColor()} />
        </View>
        <View style={styles.alertContent}>
          <Text style={styles.alertTitle}>{item.title}</Text>
          <Text style={styles.alertStudent}>{item.student}</Text>
          <Text style={styles.alertTime}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1e3a8a" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.profileContainer}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileInitial}>A</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.greetingText}>{greeting}, Admin!</Text>
              <Text style={styles.dateText}>{currentDate}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
          {dashboardData.newMessages > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{dashboardData.newMessages}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Cards de Estatísticas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo de Hoje</Text>
          <View style={styles.statsContainer}>
            <StatCard
              title="Alunos Presentes"
              value={`${dashboardData.studentsPresent}/${dashboardData.totalStudents}`}
              subtitle={`${Math.round((dashboardData.studentsPresent / dashboardData.totalStudents) * 100)}% de frequência`}
              icon="people-outline"
              color="#10b981"
              onPress={() => navigation.navigate('StudentsList')}
            />
            
            <StatCard
              title="Relatórios Pendentes"
              value={dashboardData.pendingReports}
              subtitle="Para preenchimento"
              icon="document-text-outline"
              color="#fb923c"
              onPress={() => navigation.navigate('DailyReport')}
            />
            
            <StatCard
              title="Mensagens Novas"
              value={dashboardData.newMessages}
              subtitle="Não lidas"
              icon="chatbubble-outline"
              color="#3b82f6"
              onPress={() => navigation.navigate('Messages')}
            />
            
            <StatCard
              title="Materiais em Falta"
              value={dashboardData.lowStockItems}
              subtitle="Necessitam reposição"
              icon="alert-triangle"
              color="#ef4444"
              onPress={() => navigation.navigate('MaterialsManagement')}
            />
          </View>
        </View>

        {/* Ações Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <FlatList
            data={quickActions}
            renderItem={QuickActionItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            scrollEnabled={false}
            contentContainerStyle={styles.quickActionsContainer}
          />
        </View>

        {/* Alertas Recentes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Alertas Recentes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Alerts')}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.alertsContainer}>
            {recentAlerts.map((alert) => (
              <AlertItem key={alert.id} item={alert} />
            ))}
          </View>
        </View>

        {/* Reuniões Agendadas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximas Reuniões</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Meetings')}>
              <Text style={styles.seeAllText}>Ver agenda</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.meetingCard}>
            <View style={styles.meetingInfo}>
              <Text style={styles.meetingTitle}>Reunião com Pais</Text>
              <Text style={styles.meetingDetails}>João Pedro Silva - Turma A</Text>
              <Text style={styles.meetingTime}>Hoje às 15:30</Text>
            </View>
            <TouchableOpacity style={styles.meetingButton}>
              <Text style={styles.meetingButtonText}>Detalhes</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
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
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1e3a8a',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerLeft: {
    flex: 1,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#fb923c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  greetingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#e0e7ff',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 15,
    marginHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginHorizontal: 20,
  },
  seeAllText: {
    color: '#fb923c',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    paddingHorizontal: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  statIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
  },
  quickActionItem: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 8,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  alertsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  alertItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  alertIcon: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  alertStudent: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  alertTime: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  meetingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  meetingInfo: {
    flex: 1,
  },
  meetingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  meetingDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  meetingTime: {
    fontSize: 13,
    color: '#fb923c',
    fontWeight: '600',
    marginTop: 4,
  },
  meetingButton: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  meetingButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
});