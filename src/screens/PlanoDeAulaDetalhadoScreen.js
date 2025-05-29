import { Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import MessagesModal from '../components/MessagesModal';
import NotificationModal from '../components/NotificationModal';
import ProfileMenu from '../components/ProfileMenu';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef } from 'react';
import { Animated, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const boxWidth = screenWidth * 0.9; // 90% da largura da tela



const PlanoDeAulaDetalhadoScreen = ({ route }) => {

    const heightAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;


  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [messagesVisible, setMessagesVisible] = useState(false);

  const navigation = useNavigation();

  const handleProfilePress = () => setMenuVisible(true);
  const handleNotificationPress = () => setNotificationsVisible(true);
  const handleMessagePress = () => setMessagesVisible(true);

  const { materia } = route.params;

  const [expandido, setExpandido] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

    const toggleExpand = () => {
    const toValue = expandido ? 0 : contentHeight;

    Animated.parallel([
        Animated.timing(heightAnim, {
        toValue,
        duration: 300,
        useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
        toValue: expandido ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
        }),
        Animated.timing(rotateAnim, {
        toValue: expandido ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
        }),
    ]).start();

    setExpandido(!expandido);
    };


    const rotateAnim = useRef(new Animated.Value(0)).current; //rotate icone da seta

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });


  // Exemplo de dias/horários (poderia vir de uma API ou outro local)
  const horarios = {
    'Português': '18/05/2025',
    'Inglês': 'Terça e Quinta às 14h',
    'História': 'Quarta e Sexta às 11h',
    'Matemática': 'Segunda e Quinta às 9h',
    'Geografia': 'Terça às 13h',
  };

  const ConteudoPlano = () => (
  <View>
    <Text style={styles.subtitle}>Título:</Text>
    <Text style={styles.text}>Título do Plano</Text>
    <Text style={styles.subtitle}>Objetivo:</Text>
    <Text style={styles.text}>Ensinar os fundamentos básicos de {materia}</Text>
    <Text style={styles.subtitle}>Conteúdo:</Text>
    <Text style={styles.text}>Conteúdo detalhado aqui...</Text>
  </View>
  );


    return (

        <SafeAreaView style={styles.container}>

            <Header
                onProfilePress={handleProfilePress}
                onNotificationPress={handleNotificationPress}
                onMessagePress={handleMessagePress}
            />

            <ProfileMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
            <NotificationModal visible={notificationsVisible} onClose={() => setNotificationsVisible(false)} />
            <MessagesModal visible={messagesVisible} onClose={() => setMessagesVisible(false)} />

            <View style={styles.body}>
                <View style={styles.box}>
                    <Feather name="log-out" size={30} color="#FF0000" onPress={() => navigation.navigate('PlanoDeAula')} />
                    <View style={styles.text2}>
                        <Text style={styles.title}>Plano De Aula: </Text>
                        <Text style={styles.materia}>{materia}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={toggleExpand} activeOpacity={0.8}>
                    <View style={styles.box2}>
                        <View style={styles.headerRow}>
                            <Text style={styles.title}>Apresentação</Text>
                            <Animated.View style={{ transform: [{ rotate }] }}>
                                <Ionicons name="chevron-down" size={24} color="#1E3A8A" />
                            </Animated.View>
                        </View>
                        <Text style={styles.text}>Data: {horarios[materia] || 'Horário não disponível'}</Text>

                        {contentHeight === 0 && (
                        <View
                            style={[styles.expandedSection, { position: 'absolute', opacity: 0, zIndex: -1 }]}
                            onLayout={event => {
                            setContentHeight(event.nativeEvent.layout.height);
                            }}
                        >
                            <ConteudoPlano />
                        </View>
                        )}

                        <Animated.View style={[styles.expandedSection, { height: heightAnim, opacity: opacityAnim, overflow: 'hidden' }]}>
                            <View>
                                <ConteudoPlano />
                            </View>
                        </Animated.View>

                    </View>
                </TouchableOpacity>
                
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    content: {
        paddingBottom: 24,
    },

    noReport: {
        fontSize: 18,
        color: '#64748b',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 20,
    },

    body: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFF',
    },

    box: {
        flexDirection: 'row',
        gap: 10,
        width: '90%',
        height: 60,
        backgroundColor: '#F8FAFC',
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 10,
        borderStyle: 'solid',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },

    box2: {
        width: boxWidth,
        paddingLeft: 10,
        backgroundColor: '#F8FAFC',
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 10,
        borderStyle: 'solid',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },

    title: {
        fontSize: 20,
    },

    materia: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E3A8A',
    },

    subtitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },

    text: {
        fontSize: 16,
        marginTop: 5,
    },

    text2: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginRight: 25,
    },

    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginVertical: 8,
    },

    expandedSection: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        marginTop: 8,
    },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingRight: 10,
    },

});

export default PlanoDeAulaDetalhadoScreen;
