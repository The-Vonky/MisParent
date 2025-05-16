import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { firestore, auth } from '../config/firebaseConfig';

export default function MessagesScreen() {
  const navigation = useNavigation();
  const currentUser = auth.currentUser;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [recipientId, setRecipientId] = useState('admin');
  const flatListRef = useRef(null);

  useEffect(() => {
    const q = query(
      collection(firestore, 'messages'),
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs.sort((a, b) => a.timestamp - b.timestamp));
    });

    return unsubscribe;
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;

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
    await updateDoc(doc(firestore, 'messages', messageId), { read: true });
  };

  const renderItem = ({ item }) => {
    const isCurrentUser = item.senderId === currentUser.uid;
    return (
      <View
        style={[
          styles.message,
          isCurrentUser ? styles.messageRight : styles.messageLeft,
          !item.read && !isCurrentUser && styles.unreadBorder,
        ]}
      >
        <Text style={styles.sender}>
          {isCurrentUser ? 'Você' : 'Admin'}:
        </Text>
        <Text>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Admin')}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mensagens</Text>
      </View>

      <FlatList
        data={messages}
        ref={flatListRef}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Digite sua mensagem..."
            value={text}
            onChangeText={setText}
            style={styles.input}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f4f6fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    color: '#fff',
    fontSize: 24,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  chatContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  message: {
    maxWidth: '80%',
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  messageLeft: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e7eb',
  },
  messageRight: {
    alignSelf: 'flex-end',
    backgroundColor: '#dbeafe',
  },
  unreadBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  sendButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginLeft: 10,
    justifyContent: 'center',
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});