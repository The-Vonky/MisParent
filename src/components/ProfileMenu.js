import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Ionicons from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;

const ProfileMenu = ({ visible, onClose }) => {
  const translateX = useRef(new Animated.Value(-screenWidth)).current;
  const [isVisible, setIsVisible] = useState(visible); // Controla a visibilidade da sidebar
  const [closing, setClosing] = useState(false); // Controle do fechamento da sidebar

  useEffect(() => {
    if (visible) {
      setIsVisible(true); // Torna a sidebar visível
      // Animação de entrada suave
      Animated.timing(translateX, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      setClosing(true); // Indica que está fechando
      // Animação de saída suave
      Animated.timing(translateX, {
        toValue: -screenWidth,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        // Após a animação, chama o onClose e desabilita a visibilidade
        setIsVisible(false);
        onClose();
        setClosing(false);
      });
    }
  }, [visible]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={visible ? 'auto' : 'none'}>
      {visible && (
        <Pressable style={styles.backdrop} onPress={onClose}>
          <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
        </Pressable>
      )}

      <Animated.View
        style={[
          styles.menu,
          { transform: [{ translateX }] },
          { zIndex: 9999 },
        ]}
      >
        <Text style={styles.title}>Menu</Text>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.item}>
          <Ionicons name="person" size={20} color="#1e3a8a" style={styles.icon} />
          <Text style={styles.text}>Gerenciar Usuário</Text>
          <Ionicons name="chevron-forward" size={20} color="#1e3a8a" style={styles.arrow} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.item}>
          <Ionicons name="calendar" size={20} color="#1e3a8a" style={styles.icon} />
          <Text style={styles.text}>Grade de Horários</Text>
          <Ionicons name="chevron-forward" size={20} color="#1e3a8a" style={styles.arrow} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.item}>
          <Ionicons name="list" size={20} color="#1e3a8a" style={styles.icon} />
          <Text style={styles.text}>Atividades e Tarefas</Text>
          <Ionicons name="chevron-forward" size={20} color="#1e3a8a" style={styles.arrow} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.item}>
          <Ionicons name="checkbox" size={20} color="#1e3a8a" style={styles.icon} />
          <Text style={styles.text}>Frequência</Text>
          <Ionicons name="chevron-forward" size={20} color="#1e3a8a" style={styles.arrow} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.item}>
          <Ionicons name="school" size={20} color="#1e3a8a" style={styles.icon} />
          <Text style={styles.text}>Materiais do Aluno</Text>
          <Ionicons name="chevron-forward" size={20} color="#1e3a8a" style={styles.arrow} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.item}>
          <Ionicons name="book" size={20} color="#1e3a8a" style={styles.icon} />
          <Text style={styles.text}>Plano de Aula</Text>
          <Ionicons name="chevron-forward" size={20} color="#1e3a8a" style={styles.arrow} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.item}>
          <Ionicons name="business" size={20} color="#1e3a8a" style={styles.icon} />
          <Text style={styles.text}>Secretaria</Text>
          <Ionicons name="chevron-forward" size={20} color="#1e3a8a" style={styles.arrow} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.item}>
          <Ionicons name="log-out" size={20} color="#ef4444" style={styles.icon} />
          <Text style={[styles.text, { color: '#ef4444' }]}>Sair</Text>
          <Ionicons name="chevron-forward" size={20} color="#ef4444" style={styles.arrow} />
        </TouchableOpacity>
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
    top: 34,
    left: 0,
    height: '100%',
    width: screenWidth * 0.75,
    backgroundColor: '#fff',
    padding: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 9999, // Garante que a sidebar sobreponha tudo até sair
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1e3a8a',
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },

  text: {
    fontSize: 16,
    color: '#1e3a8a',
    flex: 1,
  },

  icon: {
    marginRight: 12,
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
