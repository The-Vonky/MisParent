import { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import ProfileMenu from '../components/ProfileMenu';
import MessagesModal from '../components/MessagesModal';
import NotificationModal from '../components/NotificationModal';

const MaterialsScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [messagesVisible, setMessagesVisible] = useState(false);

  // Dados mockados do aluno
  const studentInfo = {
    name: 'Maria Eduarda Silva',
    class: 'Maternal II',
    teacher: 'Profª Ana Carolina',
    photo: '👧', // Placeholder - depois você pode usar Image
  };

  // Lista de materiais com status
  const [materials, setMaterials] = useState([
    {
      id: 1,
      name: 'Fraldas',
      category: 'Higiene',
      status: 'low', // low, ok, missing
      quantity: '2 unidades',
      lastUpdate: '2025-02-27',
      essential: true,
    },
    {
      id: 2,
      name: 'Pasta de Dente',
      category: 'Higiene',
      status: 'missing',
      quantity: '0 unidades',
      lastUpdate: '2025-02-26',
      essential: true,
    },
    {
      id: 3,
      name: 'Escova de Dente',
      category: 'Higiene',
      status: 'ok',
      quantity: '1 unidade',
      lastUpdate: '2025-02-25',
      essential: true,
    },
    {
      id: 4,
      name: 'Toalha de Rosto',
      category: 'Higiene',
      status: 'ok',
      quantity: '2 unidades',
      lastUpdate: '2025-02-24',
      essential: false,
    },
    {
      id: 5,
      name: 'Roupas Extras',
      category: 'Vestuário',
      status: 'low',
      quantity: '1 conjunto',
      lastUpdate: '2025-02-27',
      essential: true,
    },
    {
      id: 6,
      name: 'Lençol',
      category: 'Descanso',
      status: 'ok',
      quantity: '1 unidade',
      lastUpdate: '2025-02-20',
      essential: false,
    },
  ]);

  const handleProfilePress = () => setMenuVisible(true);
  const handleNotificationPress = () => setNotificationsVisible(true);
  const handleMessagePress = () => setMessagesVisible(true);

  const handleRequestMeeting = () => {
    Alert.alert(
      'Solicitar Reunião',
      'Deseja solicitar uma reunião com a professora para conversar sobre os materiais?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Solicitar', 
          onPress: () => {
            Alert.alert('Sucesso', 'Solicitação de reunião enviada!');
          }
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ok':
        return '#10b981'; // Verde
      case 'low':
        return '#f59e0b'; // Laranja
      case 'missing':
        return '#ef4444'; // Vermelho
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ok':
        return 'Suficiente';
      case 'low':
        return 'Pouco';
      case 'missing':
        return 'Faltando';
      default:
        return 'N/A';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ok':
        return 'checkmark-circle';
      case 'low':
        return 'warning';
      case 'missing':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const criticalMaterials = materials.filter(item => 
    (item.status === 'missing' || item.status === 'low') && item.essential
  );

  const MaterialItem = ({ item }) => (
    <View style={styles.materialItem}>
      <View style={styles.materialHeader}>
        <View style={styles.materialInfo}>
          <Text style={styles.materialName}>{item.name}</Text>
          <Text style={styles.materialCategory}>{item.category}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Ionicons 
            name={getStatusIcon(item.status)} 
            size={16} 
            color="white" 
          />
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      <View style={styles.materialDetails}>
        <Text style={styles.quantityText}>Quantidade: {item.quantity}</Text>
        <Text style={styles.updateText}>Última atualização: {item.lastUpdate}</Text>
        {item.essential && (
          <View style={styles.essentialBadge}>
            <Text style={styles.essentialText}>Essencial</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Header
          onProfilePress={handleProfilePress}
          onNotificationPress={handleNotificationPress}
          onMessagePress={handleMessagePress}
        />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Info do Aluno */}
          <View style={styles.studentCard}>
            <View style={styles.studentHeader}>
              <Text style={styles.studentPhoto}>{studentInfo.photo}</Text>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{studentInfo.name}</Text>
                <Text style={styles.studentClass}>{studentInfo.class}</Text>
                <Text style={styles.studentTeacher}>{studentInfo.teacher}</Text>
              </View>
            </View>
          </View>

          {/* Alertas Críticos */}
          {criticalMaterials.length > 0 && (
            <View style={styles.alertSection}>
              <View style={styles.alertHeader}>
                <Ionicons name="warning" size={24} color="#f59e0b" />
                <Text style={styles.alertTitle}>Atenção Necessária</Text>
              </View>
              <Text style={styles.alertText}>
                {criticalMaterials.length} material(is) essencial(is) precisam ser repostos
              </Text>
              <TouchableOpacity 
                style={styles.meetingButton}
                onPress={handleRequestMeeting}
              >
                <Ionicons name="calendar" size={20} color="white" />
                <Text style={styles.meetingButtonText}>Solicitar Reunião</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Lista de Materiais */}
          <View style={styles.materialsSection}>
            <Text style={styles.sectionTitle}>Materiais do Aluno</Text>
            
            {/* Materiais Essenciais */}
            <Text style={styles.subsectionTitle}>Essenciais</Text>
            {materials
              .filter(item => item.essential)
              .map(item => (
                <MaterialItem key={item.id} item={item} />
              ))}

            {/* Materiais Opcionais */}
            <Text style={styles.subsectionTitle}>Opcionais</Text>
            {materials
              .filter(item => !item.essential)
              .map(item => (
                <MaterialItem key={item.id} item={item} />
              ))}
          </View>

          {/* Botão de Comunicação */}
          <TouchableOpacity 
            style={styles.communicationButton}
            onPress={() => setMessagesVisible(true)}
          >
            <Ionicons name="chatbubbles" size={24} color="#1e40af" />
            <Text style={styles.communicationText}>
              Conversar com a Professora
            </Text>
          </TouchableOpacity>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>

      {/* Modais */}
      <ProfileMenu 
        visible={menuVisible} 
        onClose={() => setMenuVisible(false)} 
      />
      <NotificationModal 
        visible={notificationsVisible} 
        onClose={() => setNotificationsVisible(false)} 
      />
      <MessagesModal 
        visible={messagesVisible} 
        onClose={() => setMessagesVisible(false)} 
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  studentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentPhoto: {
    fontSize: 48,
    marginRight: 16,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  studentClass: {
    fontSize: 16,
    color: '#1e40af',
    fontWeight: '600',
    marginBottom: 2,
  },
  studentTeacher: {
    fontSize: 14,
    color: '#64748b',
  },
  alertSection: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400e',
    marginLeft: 8,
  },
  alertText: {
    fontSize: 14,
    color: '#92400e',
    marginBottom: 12,
  },
  meetingButton: {
    backgroundColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  meetingButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  materialsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 12,
  },
  materialItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  materialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  materialInfo: {
    flex: 1,
  },
  materialName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  materialCategory: {
    fontSize: 14,
    color: '#64748b',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  materialDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
  },
  quantityText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  updateText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  essentialBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1e40af',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  essentialText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  communicationButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1e40af',
    marginBottom: 20,
  },
  communicationText: {
    color: '#1e40af',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 24,
  },
});

export default MaterialsScreen;