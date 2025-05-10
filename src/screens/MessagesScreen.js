import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { collection, addDoc, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '../config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebaseConfig';

export default function MessagesScreen() {
  const navigation = useNavigation();
  const currentUser = auth.currentUser;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [recipientId, setRecipientId] = useState('admin'); // Pode mudar se o adm quiser mandar p/ alguém específico

  useEffect(() => {
    const messagesRef = collection(firestore, 'messages');

    const q = query(
      messagesRef,
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs.sort((a, b) => a.timestamp - b.timestamp));
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (text.trim() === '') return;

    await addDoc(collection(firestore, 'messages'), {
      text,
      senderId: currentUser.uid,
      recipientId,
      participants: [currentUser.uid, recipientId],
      timestamp: Date.now(),
      read: false,
    });

    setText('');
  };

  const markAsRead = async (messageId) => {
    const msgRef = doc(firestore, 'messages', messageId);
    await updateDoc(msgRef, { read: true });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Admin')}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mensagens</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.message, item.read ? null : styles.unread]}
            onPress={() => markAsRead(item.id)}
          >
            <Text style={styles.sender}>{item.senderId === currentUser.uid ? 'Você' : 'Outro'}:</Text>
            <Text>{item.text}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />

      <TextInput
        placeholder="Digite sua mensagem"
        value={text}
        onChangeText={setText}
        style={styles.input}
      />

      <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
        <Text style={styles.sendText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f0f0' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  backButton: { fontSize: 18, color: 'blue', marginRight: 10 },
  title: { fontSize: 20, fontWeight: 'bold' },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  sendButton: {
    backgroundColor: '#00008B',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  sendText: { color: '#fff', fontWeight: 'bold' },
  message: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  unread: {
    borderLeftWidth: 5,
    borderLeftColor: '#FF0000',
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
});