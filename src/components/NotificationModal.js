import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, TouchableWithoutFeedback } from 'react-native';
import { BlurView } from 'expo-blur';

const NotificationModal = ({ visible, onClose }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
      </Pressable>

      {/* Conteúdo fora do Pressable, para não capturar o toque */}
      <TouchableWithoutFeedback>
        <View style={styles.modal}>
          <Text style={styles.title}>Notificações</Text>
          <Text style={styles.content}>Nenhuma nova notificação.</Text>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modal: {
    position: 'absolute',
    top: 120,
    right: 16,
    width: 260,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#1e3a8a',
  },
  content: {
    fontSize: 14,
    color: '#333',
  },
});

export default NotificationModal;