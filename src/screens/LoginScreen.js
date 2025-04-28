import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import Icon from 'react-native-vector-icons/Feather';  // Importação correta do ícone

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Home');
    } catch (err) {
      setError('Email ou senha inválidos');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/Background-Login.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Image
          source={require('../../assets/Logo.png')}
          style={styles.logo}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Senha"
            placeholderTextColor="#999"
            secureTextEntry={hidePassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
            <Icon
              name={hidePassword ? 'eye-off' : 'eye'}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },

  overlay: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
    margin: 20,
    borderRadius: 20,
  },

  logo: {
    width: 195,
    height: 195,
    alignSelf: 'center',
    marginBottom: 30,
    resizeMode: 'contain',
  },

  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
  },

  inputPassword: {
    flex: 1,
    height: 50,
  },

  button: {
    backgroundColor: '#00008B',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  forgotPassword: {
    marginTop: 10,
    textAlign: 'center',
    color: '#555',
    textDecorationLine: 'underline',
  },

  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});
