import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import MessagesModal from '../components/MessagesModal';
import NotificationModal from '../components/NotificationModal';
import ProfileMenu from '../components/ProfileMenu';

const PlanoDeAulaScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [messagesVisible, setMessagesVisible] = useState(false);

  // Dados das matérias com informações mais detalhadas
  const materias = useMemo(() => [
    { 
      id: '1', 
      nome: 'Português', 
      icon: 'book-outline',
      cor: '#10b981',
      descricao: 'Planejamento de aulas de Língua Portuguesa',
      totalPlanos: 24
    },
    { 
      id: '2', 
      nome: 'Inglês', 
      icon: 'language-outline',
      cor: '#3b82f6',
      descricao: 'Planejamento de aulas de Inglês',
      totalPlanos: 18
    },
    { 
      id: '3', 
      nome: 'História', 
      icon: 'library-outline',
      cor: '#8b5cf6',
      descricao: 'Planejamento de aulas de História',
      totalPlanos: 20
    },
    { 
      id: '4', 
      nome: 'Matemática', 
      icon: 'calculator-outline',
      cor: '#f59e0b',
      descricao: 'Planejamento de aulas de Matemática',
      totalPlanos: 32
    },
    { 
      id: '5', 
      nome: 'Geografia', 
      icon: 'earth-outline',
      cor: '#ef4444',
      descricao: 'Planejamento de aulas de Geografia',
      totalPlanos: 16
    },
  ], []);

  // Handlers
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error('Erro ao atualizar planos de aula');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleProfilePress = useCallback(() => setMenuVisible(true), []);
  const handleNotificationPress = useCallback(() => setNotificationsVisible(true), []);
  const handleMessagePress = useCallback(() => setMessagesVisible(true), []);

  const handleMateriaPress = useCallback((materia) => {
    navigation.navigate('PlanoDeAulaDetalhado', { materia: materia.nome });
  }, [navigation]);

  const handleBackPress = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  // Estatísticas gerais
  const estatisticas = useMemo(() => {
    const totalPlanos = materias.reduce((acc, materia) => acc + materia.totalPlanos, 0);
    const totalMaterias = materias.length;
    const mediaPlanos = Math.round(totalPlanos / totalMaterias);

    return { totalPlanos, totalMaterias, mediaPlanos };
  }, [materias]);

  // Render components
  const renderSummaryCard = () => (
    <View style={styles.summaryContainer}>
      <Text style={styles.sectionTitle}>Resumo dos Planos</Text>
      <View style={styles.summaryContent}>
        <View style={styles.summaryItem}>
          <View style={[styles.summaryIconContainer, { backgroundColor: '#10b981' + '20' }]}>
            <Ionicons name="document-text" size={24} color="#10b981" />
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryValue}>{estatisticas.totalPlanos}</Text>
            <Text style={styles.summaryLabel}>Total de Planos</Text>
          </View>
        </View>
        
        <View style={styles.summaryDivider} />
        
        <View style={styles.summaryItem}>
          <View style={[styles.summaryIconContainer, { backgroundColor: '#3b82f6' + '20' }]}>
            <Ionicons name="school" size={24} color="#3b82f6" />
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryValue}>{estatisticas.totalMaterias}</Text>
            <Text style={styles.summaryLabel}>Disciplinas</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderMateriaItem = useCallback(({ item }) => (
    <TouchableOpacity 
      style={styles.materiaItem} 
      onPress={() => handleMateriaPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.materiaHeader}>
        <View style={[styles.materiaIconContainer, { backgroundColor: item.cor + '20' }]}>
          <Ionicons name={item.icon} size={28} color={item.cor} />
        </View>
        <View style={styles.materiaInfo}>
          <Text style={styles.materiaNome}>{item.nome}</Text>
          <Text style={styles.materiaDescricao}>{item.descricao}</Text>
        </View>
        <View style={styles.materiaActions}>
          <View style={styles.planosCount}>
            <Text style={styles.planosCountText}>{item.totalPlanos}</Text>
            <Text style={styles.planosCountLabel}>planos</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6b7280" />
        </View>
      </View>
    </TouchableOpacity>
  ), [handleMateriaPress]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1e3a8a" barStyle="light-content" />

      {/* Header customizado */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>Planos de Aula</Text>
          <Text style={styles.headerSubtitle}>Organize suas disciplinas</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Header original (mantido para funcionalidades) */}
      <View style={styles.hiddenHeader}>
        <Header
          onProfilePress={handleProfilePress}
          onNotificationPress={handleNotificationPress}
          onMessagePress={handleMessagePress}
        />
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
        {/* Summary Card */}
        {renderSummaryCard()}

        {/* Matérias List */}
        <View style={styles.materiasContainer}>
          <Text style={styles.sectionTitle}>Disciplinas</Text>
          <FlatList
            data={materias}
            renderItem={renderMateriaItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      {/* Modals */}
      <ProfileMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
      <NotificationModal visible={notificationsVisible} onClose={() => setNotificationsVisible(false)} />
      <MessagesModal visible={messagesVisible} onClose={() => setMessagesVisible(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
  },
  headerContainer: {
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
  headerContent: {
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#e0e7ff',
    fontSize: 14,
    marginTop: 2,
  },
  placeholder: {
    width: 34,
  },
  hiddenHeader: {
    height: 0,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  summaryContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1e3a8a',
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  summaryTextContainer: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 20,
  },
  materiasContainer: {
    margin: 20,
    marginTop: 0,
  },
  materiaItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  materiaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  materiaIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  materiaInfo: {
    flex: 1,
  },
  materiaNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  materiaDescricao: {
    fontSize: 14,
    color: '#6b7280',
  },
  materiaActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  planosCount: {
    alignItems: 'center',
  },
  planosCountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  planosCountLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
});

export default PlanoDeAulaScreen;