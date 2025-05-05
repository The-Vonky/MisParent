// src/screens/MensagensScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from 'react-native';

export default function MensagensScreen() {
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');

  const handleEnviarMensagem = () => {
    if (!novaMensagem.trim()) return;

    const nova = {
      texto: novaMensagem,
      data: new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMensagens([nova, ...mensagens]);
    setNovaMensagem('');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f6fa' }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Mensagens</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Nova Mensagem</Text>
        <TextInput
          placeholder="Digite sua mensagem..."
          value={novaMensagem}
          onChangeText={setNovaMensagem}
          style={styles.input}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleEnviarMensagem}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Histórico</Text>
        {mensagens.length === 0 ? (
          <Text style={{ color: '#6b7280' }}>Nenhuma mensagem enviada ainda.</Text>
        ) : (
          mensagens.map((msg, index) => (
            <View key={index} style={styles.mensagemItem}>
              <Text style={styles.mensagemTexto}>{msg.texto}</Text>
              <Text style={styles.mensagemData}>{msg.data}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#1e3a8a',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#1e3a8a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#1e3a8a',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mensagemItem: {
    backgroundColor: '#e5e7eb',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  mensagemTexto: {
    fontSize: 16,
    color: '#111827',
  },
  mensagemData: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
});