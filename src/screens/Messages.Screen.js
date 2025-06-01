import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  addDoc,
  doc,
  setDoc,
} from 'firebase/firestore';
import { auth, firestore } from '../config/firebaseConfig';

export default function MessagesScreen() {
  const navigation = useNavigation();
  const currentUser = auth.currentUser;
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentConversations, setRecentConversations] = useState([]);

  // Buscar usuários pelo nome digitado
  const handleSearch = async (text) => {
    setSearch(text);
    if (text.length === 0) {
      setSearchResults([]);
      return;
    }

    const q = query(
      collection(firestore, 'Users'),
      where('nome', '>=', text),
      where('nome', '<=', text + '\uf8ff')
    );
    const snapshot = await getDocs(q);
    const results = snapshot.docs
      .filter((doc) => doc.id !== currentUser.uid)
      .map((doc) => ({ id: doc.id, ...doc.data() }));
    setSearchResults(results);
  };

  // Buscar conversas recentes do usuário
  useEffect(() => {
    const q = query(
      collection(firestore, 'conversations'),
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecentConversations(convs);
    });

    return unsubscribe;
  }, []);

  // Iniciar ou abrir conversa existente
  const openConversation = async (targetUser) => {
    const convQuery = query(
      collection(firestore, 'conversations'),
      where('participants', 'in', [
        [currentUser.uid, targetUser.id],
        [targetUser.id, currentUser.uid],
      ])
    );

    const convSnapshot = await getDocs(convQuery);

    let conversationId;

    if (!convSnapshot.empty) {
      conversationId = convSnapshot.docs[0].id;
    } else {
      const newConv = await addDoc(collection(firestore, 'conversations'), {
        participants: [currentUser.uid, targetUser.id],
        createdAt: Date.now(),
      });
      conversationId = newConv.id;
    }

    navigation.navigate('Chat', {
      conversationId,
      recipientName: targetUser.nome,
      recipientId: targetUser.id,
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Pesquisar usuário..."
        value={search}
        onChangeText={handleSearch}
        style={styles.searchInput}
      />

      {search.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userItem}
              onPress={() => openConversation(item)}
            >
              <Text style={styles.userName}>{item.nome}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <>
          <Text style={styles.sectionTitle}>Conversas recentes</Text>
          <FlatList
            data={recentConversations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const otherUserId = item.participants.find((uid) => uid !== currentUser.uid);
              return (
                <TouchableOpacity
                  style={styles.userItem}
                  onPress={() =>
                    openConversation({ id: otherUserId, nome: 'Usuário' /* Substituir com nome real */ })
                  }
                >
                  <Text style={styles.userName}>Conversa com {otherUserId}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#f4f6fa',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#1e3a8a',
  },
  userItem: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
});