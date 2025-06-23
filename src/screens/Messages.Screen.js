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
  doc,
  getDoc,
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
      
      const results = snapshot.docs
        .filter((doc) => doc.id !== currentUser.uid)
        .map((doc) => {
          const data = doc.data();
          console.log('Dados do usuário encontrado:', {
            id: doc.id,
            nome: data.nome,
            imagemUri: data.imagemUri,
            photoURL: data.photoURL, // Caso use outro campo
          });
          return { id: doc.id, ...data };
        });
      
      console.log('Resultados após filtro:', results);
      setSearchResults(results);
    } catch (error) {
      console.error('Erro na busca:', error);
    }
  };

  // Função melhorada para buscar dados do usuário
  const getUserData = async (userId) => {
    try {
      console.log('Buscando dados para userId:', userId);
      
      // Método mais direto usando doc()
      const userDocRef = doc(firestore, 'Alunos', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Dados encontrados:', {
          id: userId,
          nome: userData.nome,
          imagemUri: userData.imagemUri,
          photoURL: userData.photoURL, // Caso use outro campo
        });
        
        return {
          id: userId,
          nome: userData.nome || 'Usuário',
          // Tenta diferentes campos para a imagem
          imagemUri: userData.imagemUri || userData.photoURL || userData.profileImage || null,
        };
      } else {
        console.log('Documento não encontrado para userId:', userId);
        return {
          id: userId,
          nome: 'Usuário',
          imagemUri: null,
        };
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return {
        id: userId,
        nome: 'Usuário',
        imagemUri: null,
      };
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

      console.log('Conversas encontradas:', convs.length);

      // Buscar dados dos outros participantes
      const conversationsWithUserData = await Promise.all(
        convs.map(async (conv) => {
          const otherUserId = conv.participants.find(
            (uid) => uid !== currentUser.uid
          );
          
          const userData = await getUserData(otherUserId);
          
          return {
            ...conv,
            otherUser: userData,
          };
        })
      );

      console.log('Conversas com dados dos usuários:', conversationsWithUserData);
      setRecentConversations(conversationsWithUserData);
    });

    return unsubscribe;
  }, []);

  const openConversation = async (targetUser) => {
    try {
      console.log('Abrindo conversa com:', targetUser);
      
      // Buscar conversa existente
      const convQuery = query(
        collection(firestore, 'conversations'),
        where('participants', 'array-contains', currentUser.uid)
      );

      const convSnapshot = await getDocs(convQuery);
      let conversationId = null;

      // Verificar se já existe uma conversa entre os dois usuários
      for (const doc of convSnapshot.docs) {
        const data = doc.data();
        if (data.participants.includes(targetUser.id)) {
          conversationId = doc.id;
          console.log('Conversa existente encontrada:', conversationId);
          break;
        }
      }

      // Se não existir, criar nova conversa
      if (!conversationId) {
        console.log('Criando nova conversa...');
        const newConv = await addDoc(collection(firestore, 'conversations'), {
          participants: [currentUser.uid, targetUser.id],
          createdAt: Date.now(),
          lastMessage: '',
          lastMessageTime: Date.now(),
        });
        conversationId = newConv.id;
        console.log('Nova conversa criada:', conversationId);
      }

      // Navegar para a tela de chat
      navigation.navigate('Chat', {
        conversationId,
        recipientName: targetUser.nome,
        recipientId: targetUser.id,
      });
    } catch (error) {
      console.error('Erro ao abrir conversa:', error);
    }
  };

  // Componente melhorado para renderizar avatar
  const renderAvatar = (user) => {
    const imageUri = user.imagemUri || user.photoURL || user.profileImage;
    
    console.log('Renderizando avatar para:', {
      nome: user.nome,
      imagemUri: imageUri,
    });

    if (imageUri && imageUri.trim() !== '') {
      return (
        <Image 
          source={{ uri: imageUri }} 
          style={styles.avatarImage}
          onError={(error) => {
            console.log('Erro ao carregar imagem:', error.nativeEvent.error);
            console.log('URI da imagem:', imageUri);
          }}
          onLoad={() => {
            console.log('Imagem carregada com sucesso:', imageUri);
          }}
        />
      );
    } else {
      return (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
      );
    }
  };

  const renderMessageItem = ({ item }) => (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() => openConversation(item)}
    >
      <View style={styles.avatarContainer}>
        {renderAvatar(item)}
      </View>
      <View style={styles.messageContent}>
        <Text style={styles.name}>{item.nome || 'Usuário'}</Text>
        <Text style={styles.subject}>Toque para conversar</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
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
                  {renderAvatar(item.otherUser)}
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
    paddingBottom: 15,
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
    width: 34,
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
    backgroundColor: '#f0f0f0', // Cor de fundo enquanto carrega
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