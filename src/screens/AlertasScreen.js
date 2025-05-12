// src/screens/AlertasScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

export default function AlertasScreen() {
  const [alertas, setAlertas] = useState([]);
  const [novoAlerta, setNovoAlerta] = useState('');

  const handleEnviarAlerta = () => {
    if (!novoAlerta.trim()) return;

    const novo = {
      texto: novoAlerta,
      data: new Date().toLocaleDateString(),
    };

    setAlertas([novo, ...alertas]);
    setNovoAlerta('');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f6fa' }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Alertas / Recados</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Novo Alerta</Text>
        <TextInput
          placeholder="Digite o alerta ou recado..."
          value={novoAlerta}
          onChangeText={setNovoAlerta}
          style={styles.input}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleEnviarAlerta}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Histórico</Text>
        {alertas.length === 0 ? (
          <Text style={{ color: '#6b7280' }}>Nenhum alerta enviado ainda.</Text>
        ) : (
          alertas.map((item, index) => (
            <View key={index} style={styles.alertaItem}>
              <Text style={styles.alertaTexto}>{item.texto}</Text>
              <Text style={styles.alertaData}>{item.data}</Text>
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
  alertaItem: {
    backgroundColor: '#e5e7eb',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  alertaTexto: {
    fontSize: 16,
    color: '#111827',
  },
  alertaData: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
});