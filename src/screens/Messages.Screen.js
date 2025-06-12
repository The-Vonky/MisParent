import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  addDoc,
} from 'firebase/firestore';
import { auth, firestore } from '../config/firebaseConfig';

export default function MessagesScreen() {
  const navigation = useNavigation();
  const currentUser = auth.currentUser;
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentConversations, setRecentConversations] = useState([]);

  const handleSearch = async (text) => {
    setSearch(text);
    if (text.length === 0) {
      setSearchResults([]);
      return;
    }

    try {
      console.log('Buscando por:', text);
      console.log('UID atual:', currentUser.uid);

      const q = query(
        collection(firestore, 'Alunos'),
        where('nome', '>=', text),
        where('nome', '<=', text + '\uf8ff')
      );
      
      const snapshot = await getDocs(q);
      console.log('Documentos encontrados:', snapshot.docs.length);
      
      snapshot.docs.forEach(doc => {
        console.log('Documento:', doc.id, doc.data());
      });

      const results = snapshot.docs
        .filter((doc) => doc.id !== currentUser.uid)
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      
      console.log('Resultados após filtro:', results);
      setSearchResults(results);
    } catch (error) {
      console.error('Erro na busca:', error);
    }
  };

  useEffect(() => {
    const q = query(
      collection(firestore, 'conversations'),
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const convs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Buscar dados dos outros participantes
      const conversationsWithUserData = await Promise.all(
        convs.map(async (conv) => {
          const otherUserId = conv.participants.find(
            (uid) => uid !== currentUser.uid
          );
          
          try {
            const userDoc = await getDocs(
              query(collection(firestore, 'Alunos'), where('__name__', '==', otherUserId))
            );
            
            if (!userDoc.empty) {
              const userData = userDoc.docs[0].data();
              return {
                ...conv,
                otherUser: {
                  id: otherUserId,
                  nome: userData.nome || 'Usuário',
                  imagemUri: userData.imagemUri || null,
                }
              };
            }
          } catch (error) {
            console.log('Erro ao buscar dados do usuário:', error);
          }
          
          return {
            ...conv,
            otherUser: {
              id: otherUserId,
              nome: 'Usuário',
              imagemUri: null,
            }
          };
        })
      );

      setRecentConversations(conversationsWithUserData);
    });

    return unsubscribe;
  }, []);

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

  const renderMessageItem = ({ item }) => (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() => openConversation(item)}
    >
      <View style={styles.avatarContainer}>
        {item.imagemUri ? (
          <Image source={{ uri: item.imagemUri }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.nome ? item.nome.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.messageContent}>
        <Text style={styles.name}>{item.nome || 'Usuário'}</Text>
        <Text style={styles.subject}>Toque para conversar</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* StatusBar com background azul e texto claro */}
      <StatusBar backgroundColor="#1e3a8a" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Mensagens</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Campo de pesquisa */}
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
          renderItem={renderMessageItem}
          style={styles.flatList}
        />
      ) : (
        <>
          <Text style={styles.sectionTitle}>Conversas recentes</Text>
          <FlatList
            data={recentConversations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.messageItem}
                onPress={() => openConversation(item.otherUser)}
              >
                <View style={styles.avatarContainer}>
                  {item.otherUser?.imagemUri ? (
                    <Image source={{ uri: item.otherUser.imagemUri }} style={styles.avatarImage} />
                  ) : (
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {item.otherUser?.nome ? item.otherUser.nome.charAt(0).toUpperCase() : 'U'}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.messageContent}>
                  <Text style={styles.name}>
                    {item.otherUser?.nome || 'Usuário'}
                  </Text>
                  <Text style={styles.subject}>Conversa ativa</Text>
                </View>
              </TouchableOpacity>
            )}
            style={styles.flatList}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1e3a8a',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 34, // Para balancear o header
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    margin: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 20,
    color: '#1e3a8a',
  },
  flatList: {
    flex: 1,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 6,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  subject: {
    fontSize: 14,
    color: '#666',
  },
});