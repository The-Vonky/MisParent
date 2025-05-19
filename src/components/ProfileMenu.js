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
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { BlurView } from 'expo-blur';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image } from 'react-native';


const screenWidth = Dimensions.get('window').width;

const ProfileMenu = ({ visible, onClose, user }) => {
  const translateX = useRef(new Animated.Value(-screenWidth)).current;
  const [isVisible, setIsVisible] = useState(visible);

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

        <View style={styles.header}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/300' }} // essa URL gera um rosto aleatório
            style={styles.avatar}
          />

          <View style={styles.infoContainer}>
            <Text style={styles.username}>{user?.name || 'Nome do Usuário'}</Text>
            <Text style={styles.role}>{user?.role || 'Tipo do Usuário'}</Text>
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
        <MenuItem icon="book" label="Plano de Aula" />
        <View style={styles.divider} />
        <MenuItem icon="business" label="Secretaria" />
        <View style={styles.divider} />
        <MenuItem icon="settings" label="Configurações" />

        <View style={styles.divider} />

        <MenuItem icon="log-out" label="Sair" color="#ef4444" onPress={handleLogout} />
      </Animated.View>
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
});

export default ProfileMenu;