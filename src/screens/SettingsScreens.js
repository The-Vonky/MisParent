import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [dailyReportsEnabled, setDailyReportsEnabled] = useState(true);
  const [emergencyAlertsEnabled, setEmergencyAlertsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: () => {
            // Aqui você implementaria a lógica de logout
            console.log('Usuário deslogado');
          }
        }
      ]
    );
  };

  const handlePersonalInfo = () => {
    // Navegar para tela de informações pessoais
    navigation.navigate('PersonalInfo');
  };

  const handleChangePassword = () => {
    // Navegar para tela de mudança de senha
    navigation.navigate('ChangePassword');
  };

  const handleTermsOfService = () => {
    // Navegar para tela de termos de serviço
    navigation.navigate('TermsOfService');
  };

  const handlePrivacyPolicy = () => {
    // Navegar para tela de política de privacidade
    navigation.navigate('PrivacyPolicy');
  };

  const renderSectionHeader = (title) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  const renderOptionItem = ({ icon, iconType = 'Ionicons', title, subtitle, onPress, rightElement }) => (
    <TouchableOpacity 
      style={styles.optionItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.optionLeft}>
        <View style={styles.iconContainer}>
          {iconType === 'Ionicons' && <Ionicons name={icon} size={22} color="#1e3a8a" />}
          {iconType === 'Feather' && <Feather name={icon} size={22} color="#1e3a8a" />}
          {iconType === 'MaterialIcons' && <MaterialIcons name={icon} size={22} color="#1e3a8a" />}
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionTitle}>{title}</Text>
          {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement || (onPress && <Ionicons name="chevron-forward" size={20} color="#9ca3af" />)}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1e3a8a" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Configurações</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Seção Conta */}
        <View style={styles.section}>
          {renderSectionHeader('Conta')}
          <View style={styles.sectionCard}>
            {renderOptionItem({
              icon: 'person-outline',
              title: 'Informações pessoais',
              subtitle: 'Nome, e-mail, telefone',
              onPress: handlePersonalInfo
            })}
            
            {renderOptionItem({
              icon: 'lock',
              iconType: 'Feather',
              title: 'Mudar senha',
              subtitle: 'Alterar sua senha de acesso',
              onPress: handleChangePassword
            })}
          </View>
        </View>

        {/* Seção Notificações */}
        <View style={styles.section}>
          {renderSectionHeader('Notificações')}
          <View style={styles.sectionCard}>
            {renderOptionItem({
              icon: 'notifications-outline',
              title: 'Notificações push',
              subtitle: 'Receber notificações no dispositivo',
              rightElement: (
                <Switch
                  value={pushEnabled}
                  onValueChange={setPushEnabled}
                  trackColor={{ false: '#e5e7eb', true: '#fb923c' }}
                  thumbColor={pushEnabled ? '#fff' : '#f3f4f6'}
                />
              )
            })}
            
            {renderOptionItem({
              icon: 'mail',
              iconType: 'Feather',
              title: 'Notificações por e-mail',
              subtitle: 'Receber resumos por e-mail',
              rightElement: (
                <Switch
                  value={emailEnabled}
                  onValueChange={setEmailEnabled}
                  trackColor={{ false: '#e5e7eb', true: '#fb923c' }}
                  thumbColor={emailEnabled ? '#fff' : '#f3f4f6'}
                />
              )
            })}
            
            {renderOptionItem({
              icon: 'document-text-outline',
              title: 'Relatórios diários',
              subtitle: 'Resumo das atividades do seu filho',
              rightElement: (
                <Switch
                  value={dailyReportsEnabled}
                  onValueChange={setDailyReportsEnabled}
                  trackColor={{ false: '#e5e7eb', true: '#fb923c' }}
                  thumbColor={dailyReportsEnabled ? '#fff' : '#f3f4f6'}
                />
              )
            })}
            
            {renderOptionItem({
              icon: 'alert-circle-outline',
              title: 'Alertas de emergência',
              subtitle: 'Avisos importantes da escola',
              rightElement: (
                <Switch
                  value={emergencyAlertsEnabled}
                  onValueChange={setEmergencyAlertsEnabled}
                  trackColor={{ false: '#e5e7eb', true: '#fb923c' }}
                  thumbColor={emergencyAlertsEnabled ? '#fff' : '#f3f4f6'}
                />
              )
            })}
          </View>
        </View>

        {/* Seção Comunicação */}
        <View style={styles.section}>
          {renderSectionHeader('Comunicação')}
          <View style={styles.sectionCard}>
            {renderOptionItem({
              icon: 'calendar-outline',
              title: 'Agendar reunião',
              subtitle: 'Marcar horário com a coordenação',
              onPress: () => navigation.navigate('ScheduleMeeting')
            })}
            
            {renderOptionItem({
              icon: 'chatbubble-outline',
              title: 'Suporte',
              subtitle: 'Fale conosco para dúvidas',
              onPress: () => navigation.navigate('Support')
            })}
          </View>
        </View>

        {/* Seção Sobre */}
        <View style={styles.section}>
          {renderSectionHeader('Sobre')}
          <View style={styles.sectionCard}>
            {renderOptionItem({
              icon: 'file-text',
              iconType: 'Feather',
              title: 'Termos de serviço',
              onPress: handleTermsOfService
            })}
            
            {renderOptionItem({
              icon: 'privacy-tip',
              iconType: 'MaterialIcons',
              title: 'Política de privacidade',
              onPress: handlePrivacyPolicy
            })}
            
            {renderOptionItem({
              icon: 'information-circle-outline',
              title: 'Versão do aplicativo',
              rightElement: <Text style={styles.versionText}>1.0.0</Text>
            })}
          </View>
        </View>

        {/* Botão de Sair */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          <Text style={styles.logoutButtonText}>Sair da conta</Text>
        </TouchableOpacity>

        {/* Espaço extra no final */}
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
  placeholder: {
    width: 34,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 20,
    color: '#1e3a8a',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  versionText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});