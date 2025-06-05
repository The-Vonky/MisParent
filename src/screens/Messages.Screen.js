import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { firestore, auth } from '../config/firebaseConfig';

export default function MessagesScreen() {
  const navigation = useNavigation();
  const currentUser = auth.currentUser;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const flatListRef = useRef(null);
  const [sending, setSending] = useState(false);
  const recipientId = 'admin';

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(firestore, 'messages'),
      where('participants', 'array-contains', currentUser.uid),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toMillis?.() ?? Date.now(),
      }));
      setMessages(msgs);
      markUnreadMessagesAsRead(msgs);
    }, (error) => {
      console.error('Erro ao buscar mensagens:', error);
      Alert.alert('Erro', 'Não foi possível carregar as mensagens.');
    });

    return () => unsubscribe();
  }, [currentUser]);

  const markUnreadMessagesAsRead = useCallback(async (msgs) => {
    const unreadMsgs = msgs.filter(
      (msg) => !msg.read && msg.senderId !== currentUser.uid
    );

    for (const msg of unreadMsgs) {
      try {
        await updateDoc(doc(firestore, 'messages', msg.id), { read: true });
      } catch (error) {
        console.warn('Erro ao marcar mensagem como lida:', error);
      }
    }
  }, [currentUser]);

  const sendMessage = async () => {
    if (sending || !text.trim()) return;
    setSending(true);

    try {
      await addDoc(collection(firestore, 'messages'), {
        text: text.trim(),
        senderId: currentUser.uid,
        recipientId,
        participants: [currentUser.uid, recipientId],
        timestamp: serverTimestamp(),
        read: false,
      });
      setText('');
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      Alert.alert('Erro', 'Não foi possível enviar a mensagem.');
    } finally {
      setSending(false);
    }
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
        accessible
        accessibilityLabel={`${isCurrentUser ? 'Você' : 'Admin'}: ${item.text}`}
      >
        <Text style={styles.sender}>{isCurrentUser ? 'Você' : 'Admin'}:</Text>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} accessibilityRole="header">Mensagens</Text>
      </View>

      <FlatList
        data={messages}
        ref={flatListRef}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 80 })}
      >
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Digite sua mensagem..."
            value={text}
            onChangeText={setText}
            style={styles.input}
            multiline
            editable={!sending}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
            accessibilityLabel="Campo de mensagem"
          />
          <TouchableOpacity
            style={[styles.sendButton, sending && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={sending}
            accessibilityRole="button"
            accessibilityLabel="Enviar mensagem"
          >
            <Text style={styles.sendText}>{sending ? '...' : '➤'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 4,
  },
  backButton: {
    color: '#fff',
    fontSize: 26,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '600',
  },
  chatContainer: {
    padding: 20,
    paddingBottom: 10,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  message: {
    maxWidth: '80%',
    marginVertical: 6,
    padding: 12,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  messageLeft: {
    alignSelf: 'flex-start',
    backgroundColor: '#e2e8f0',
  },
  messageRight: {
    alignSelf: 'flex-end',
    backgroundColor: '#bfdbfe',
  },
  unreadBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#f87171',
  },
  sender: {
    fontWeight: '600',
    marginBottom: 4,
    fontSize: 14,
    color: '#374151',
  },
  messageText: {
    fontSize: 15,
    color: '#111827',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f3f4f6',
  },
  sendButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});