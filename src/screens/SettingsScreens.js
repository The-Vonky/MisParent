import React, { useState, useCallback } from 'react';
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
  Animated,
  Dimensions,
  Haptics,
  Platform,
} from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [dailyReportsEnabled, setDailyReportsEnabled] = useState(true);
  const [emergencyAlertsEnabled, setEmergencyAlertsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const scrollY = new Animated.Value(0);

  const handleToggle = useCallback((setter, value) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setter(!value);
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair da sua conta? Você precisará fazer login novamente para acessar o aplicativo.',
      [
        { 
          text: 'Cancelar', 
          style: 'cancel',
          onPress: () => {
            if (Platform.OS === 'ios') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
          }
        },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: () => {
            if (Platform.OS === 'ios') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            // Limpar dados do usuário (tokens, dados locais, etc.)
            console.log('Usuário deslogado');
            
            // Navegar para a tela de login e resetar o stack de navegação
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  const handlePersonalInfo = () => {
    navigation.navigate('PersonalInfo');
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleTermsOfService = () => {
    navigation.navigate('TermsOfService');
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  const handleExportData = () => {
    Alert.alert(
      'Exportar Dados',
      'Seus dados serão exportados em formato PDF e enviados para seu e-mail.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Exportar', onPress: () => console.log('Exportando dados...') }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir Conta',
      'Esta ação é irreversível. Todos os seus dados serão permanentemente removidos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirmação Final',
              'Digite "CONFIRMO" para excluir sua conta permanentemente.',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Confirmar Exclusão', style: 'destructive' }
              ]
            );
          }
        }
      ]
    );
  };

  const renderSectionHeader = (title, subtitle) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderOptionItem = ({ 
    icon, 
    iconType = 'Ionicons', 
    title, 
    subtitle, 
    onPress, 
    rightElement,
    danger = false,
    badge = null
  }) => (
    <TouchableOpacity 
      style={[
        styles.optionItem,
        danger && styles.dangerOption
      ]} 
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.optionLeft}>
        <View style={[
          styles.iconContainer,
          danger && styles.dangerIconContainer
        ]}>
          {iconType === 'Ionicons' && (
            <Ionicons 
              name={icon} 
              size={22} 
              color={danger ? "#dc2626" : "#1e3a8a"} 
            />
          )}
          {iconType === 'Feather' && (
            <Feather 
              name={icon} 
              size={22} 
              color={danger ? "#dc2626" : "#1e3a8a"} 
            />
          )}
          {iconType === 'MaterialIcons' && (
            <MaterialIcons 
              name={icon} 
              size={22} 
              color={danger ? "#dc2626" : "#1e3a8a"} 
            />
          )}
        </View>
        <View style={styles.optionTextContainer}>
          <View style={styles.titleRow}>
            <Text style={[
              styles.optionTitle,
              danger && styles.dangerText
            ]}>
              {title}
            </Text>
            {badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            )}
          </View>
          {subtitle && (
            <Text style={styles.optionSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      {rightElement || (onPress && (
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color="#9ca3af" 
        />
      ))}
    </TouchableOpacity>
  );

  const renderToggleSwitch = (value, setter, trackColor = '#fb923c') => (
    <Switch
      value={value}
      onValueChange={() => handleToggle(setter, value)}
      trackColor={{ false: '#e5e7eb', true: trackColor }}
      thumbColor={value ? '#fff' : '#f3f4f6'}
      ios_backgroundColor="#e5e7eb"
    />
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1e3a8a" barStyle="light-content" />

      {/* Header com animação */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Configurações</Text>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-circle" size={28} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Seção Conta */}
        <View style={styles.section}>
          {renderSectionHeader('Conta', 'Gerencie suas informações pessoais')}
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
              title: 'Alterar senha',
              subtitle: 'Mudar sua senha de acesso',
              onPress: handleChangePassword
            })}

            {renderOptionItem({
              icon: 'finger-print',
              iconType: 'MaterialIcons',
              title: 'Autenticação biométrica',
              subtitle: 'Use Touch ID ou Face ID',
              rightElement: renderToggleSwitch(biometricEnabled, setBiometricEnabled, '#10b981'),
              badge: 'NOVO'
            })}
          </View>
        </View>

        {/* Seção Notificações */}
        <View style={styles.section}>
          {renderSectionHeader('Notificações', 'Configure como deseja ser notificado')}
          <View style={styles.sectionCard}>
            {renderOptionItem({
              icon: 'notifications-outline',
              title: 'Notificações push',
              subtitle: 'Receber notificações no dispositivo',
              rightElement: renderToggleSwitch(pushEnabled, setPushEnabled)
            })}
            
            {renderOptionItem({
              icon: 'mail',
              iconType: 'Feather',
              title: 'Notificações por e-mail',
              subtitle: 'Receber resumos por e-mail',
              rightElement: renderToggleSwitch(emailEnabled, setEmailEnabled)
            })}
            
            {renderOptionItem({
              icon: 'volume-high',
              iconType: 'Ionicons',
              title: 'Sons de notificação',
              subtitle: 'Tocar som ao receber notificações',
              rightElement: renderToggleSwitch(soundEnabled, setSoundEnabled, '#8b5cf6')
            })}
            
            {renderOptionItem({
              icon: 'document-text-outline',
              title: 'Relatórios diários',
              subtitle: 'Resumo das atividades do seu filho',
              rightElement: renderToggleSwitch(dailyReportsEnabled, setDailyReportsEnabled)
            })}
            
            {renderOptionItem({
              icon: 'alert-circle-outline',
              title: 'Alertas de emergência',
              subtitle: 'Avisos importantes da escola',
              rightElement: renderToggleSwitch(emergencyAlertsEnabled, setEmergencyAlertsEnabled, '#ef4444')
            })}
          </View>
        </View>

        {/* Seção Aparência */}
        <View style={styles.section}>
          {renderSectionHeader('Aparência', 'Personalize a interface do aplicativo')}
          <View style={styles.sectionCard}>
            {renderOptionItem({
              icon: 'moon-outline',
              title: 'Modo escuro',
              subtitle: 'Interface com cores escuras',
              rightElement: renderToggleSwitch(darkMode, setDarkMode, '#6366f1')
            })}
            
            {renderOptionItem({
              icon: 'color-palette-outline',
              title: 'Tema do aplicativo',
              subtitle: 'Escolher cores personalizadas',
              onPress: () => navigation.navigate('ThemeSettings')
            })}
          </View>
        </View>

        {/* Seção Comunicação */}
        <View style={styles.section}>
          {renderSectionHeader('Comunicação', 'Interaja com a escola')}
          <View style={styles.sectionCard}>
            {renderOptionItem({
              icon: 'calendar-outline',
              title: 'Agendar reunião',
              subtitle: 'Marcar horário com a coordenação',
              onPress: () => navigation.navigate('ScheduleMeeting')
            })}
            
            {renderOptionItem({
              icon: 'chatbubble-outline',
              title: 'Suporte técnico',
              subtitle: 'Fale conosco para dúvidas',
              onPress: () => navigation.navigate('Support')
            })}

            {renderOptionItem({
              icon: 'star-outline',
              title: 'Avaliar aplicativo',
              subtitle: 'Deixe sua avaliação na loja',
              onPress: () => console.log('Abrindo loja de apps...')
            })}
          </View>
        </View>

        {/* Seção Privacidade e Dados */}
        <View style={styles.section}>
          {renderSectionHeader('Privacidade e Dados', 'Controle seus dados pessoais')}
          <View style={styles.sectionCard}>
            {renderOptionItem({
              icon: 'download-outline',
              title: 'Exportar meus dados',
              subtitle: 'Baixar uma cópia dos seus dados',
              onPress: handleExportData
            })}
            
            {renderOptionItem({
              icon: 'trash-outline',
              title: 'Limpar cache',
              subtitle: 'Remover dados temporários',
              onPress: () => {
                Alert.alert(
                  'Limpar Cache',
                  'Isso pode melhorar a performance do app.',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Limpar', onPress: () => console.log('Cache limpo') }
                  ]
                );
              }
            })}
          </View>
        </View>

        {/* Seção Sobre */}
        <View style={styles.section}>
          {renderSectionHeader('Sobre', 'Informações legais e do aplicativo')}
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
              rightElement: <Text style={styles.versionText}>v1.2.3</Text>
            })}

            {renderOptionItem({
              icon: 'code-outline',
              title: 'Licenças de código aberto',
              onPress: () => navigation.navigate('OpenSourceLicenses')
            })}
          </View>
        </View>

        {/* Seção Zona de Perigo */}
        <View style={styles.section}>
          {renderSectionHeader('Zona de Perigo', 'Ações irreversíveis')}
          <View style={styles.sectionCard}>
            {renderOptionItem({
              icon: 'trash-2',
              iconType: 'Feather',
              title: 'Excluir conta',
              subtitle: 'Remover permanentemente sua conta',
              onPress: handleDeleteAccount,
              danger: true
            })}
          </View>
        </View>

        {/* Botão de Sair Aprimorado */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <View style={styles.logoutIconContainer}>
            <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          </View>
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 EduConnect - Conectando famílias e escolas
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  profileButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 25,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    marginBottom: 12,
    marginLeft: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '400',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    minHeight: 70,
  },
  dangerOption: {
    backgroundColor: '#fef2f2',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  dangerIconContainer: {
    backgroundColor: '#fef2f2',
  },
  optionTextContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: 20,
  },
  dangerText: {
    color: '#dc2626',
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 16,
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  versionText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    marginHorizontal: 20,
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#fecaca',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#dc2626',
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 30,
  },
});