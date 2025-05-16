import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';

const MessagesModal = ({ visible, onClose }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
      </Pressable>

      <View style={styles.modal}>
        <Text style={styles.title}>Mensagens</Text>
        <Text style={styles.content}>Nenhuma nova mensagem.</Text>
      </View>
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
    elevation: 6,
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

export default MessagesModal;
