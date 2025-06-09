import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
  Alert,
  Modal,
  SafeAreaView,
  Image,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { BlurView } from 'expo-blur';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const ProfileMenu = ({ visible, onClose, user }) => {
  const translateX = useRef(new Animated.Value(-screenWidth)).current;
  const [isVisible, setIsVisible] = useState(visible);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: -screenWidth,
        duration: 450,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
        onClose();
      });
    }
  }, [visible]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível sair da conta.');
    }
  };

  if (!isVisible) return null;

  const MenuItem = ({ icon, label, color = '#1e3a8a', onPress }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Ionicons name={icon} size={20} color={color} style={styles.icon} />
      <Text style={[styles.text, { color }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color={color} style={styles.arrow} />
    </TouchableOpacity>
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={visible ? 'auto' : 'none'}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
      </Pressable>

      <Animated.View style={[styles.menu, { transform: [{ translateX }] }]}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <Image
              source={{
                uri: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2017/07/Sir-Ian-McKellen-as-Gandalf-The-Grey-The-Shire-Lord-of-the-Rings-Peter-Jackson.jpg',
              }}
              style={styles.avatar}
            />

            <View style={styles.infoContainer}>
              <Text style={styles.username}>{user?.name || 'Nome do Usuário'}</Text>
              <Text style={styles.role}>{user?.role || 'Trocar de Usuário'}</Text>
            </View>
          </View>

        <View style={styles.divider} />
        <MenuItem icon="person" label="Gerenciar Usuário" />
        <View style={styles.divider} />
        <MenuItem icon="calendar" label="Grade de Horários" />
        <View style={styles.divider} />
        <MenuItem icon="list" label="Atividades e Tarefas" />
        <View style={styles.divider} />
        <MenuItem icon="checkbox" label="Frequência" />
        <View style={styles.divider} />
        <MenuItem icon="school" label="Materiais do Aluno" />
        <View style={styles.divider} />
        <MenuItem icon="book" label="Plano de Aula" onPress={() => navigation.navigate('PlanoDeAula')} />
        <View style={styles.divider} />
        <MenuItem icon="business" label="Secretaria" />
        <View style={styles.divider} />
        <MenuItem icon="settings" label="Configurações" />
        <View style={styles.divider} />

          <View style={{ flex: 1 }} />
          <View style={styles.divider} />
          <MenuItem
            icon="log-out"
            label="Sair"
            color="#ef4444"
            onPress={() => setShowLogoutModal(true)}
          />
        </SafeAreaView>
      </Animated.View>

      <Modal
        transparent
        animationType="fade"
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar saída</Text>
            <Text style={styles.modalText}>Deseja mesmo sair da conta?</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ef4444' }]}
                onPress={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
              >
                <Text style={styles.modalButtonText}>Sim</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#6b7280' }]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalButtonText}>Não</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: screenWidth * 0.75,
    backgroundColor: '#fff',
    padding: 20,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#d1d5db',
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  role: {
    fontSize: 12,
    color: '#6b7280',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  icon: {
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    flex: 1,
  },
  arrow: {
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#374151',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProfileMenu;