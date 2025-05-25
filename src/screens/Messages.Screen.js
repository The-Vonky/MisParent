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
  const recipientId = 'admin'; // fixo, pode ser dinamizado depois

  // Listener para mensagens do usuário, ordenando por timestamp
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(firestore, 'messages'),
      where('participants', 'array-contains', currentUser.uid),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toMillis
            ? doc.data().timestamp.toMillis()
            : doc.data().timestamp || Date.now(),
        }));
        setMessages(msgs);
        markUnreadMessagesAsRead(msgs);
      },
      (error) => {
        console.error('Erro ao buscar mensagens:', error);
        Alert.alert('Erro', 'Não foi possível carregar as mensagens.');
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Função para marcar mensagens recebidas e não lidas como lidas
  const markUnreadMessagesAsRead = useCallback(
    async (msgs) => {
      const unreadMsgs = msgs.filter(
        (msg) => !msg.read && msg.senderId !== currentUser.uid
      );

      unreadMsgs.forEach(async (msg) => {
        try {
          await updateDoc(doc(firestore, 'messages', msg.id), { read: true });
        } catch (error) {
          console.warn('Erro ao marcar mensagem como lida:', error);
        }
      });
    },
    [currentUser]
  );

  // Enviar mensagem (com debounce simples)
  const sendMessage = async () => {
    if (sending) return;
    if (!text.trim()) return;

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
      // Scroll para o final após enviar mensagem
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

  // Renderização da mensagem
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} accessibilityRole="header">
          Mensagens
        </Text>
      </View>

      <FlatList
        data={messages}
        ref={flatListRef}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
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
            <Text style={styles.sendText}>{sending ? 'Enviando...' : 'Enviar'}</Text>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    color: '#fff',
    fontSize: 28,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  chatContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexGrow: 1,
    justifyContent: 'flex-end',
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginLeft: 10,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
