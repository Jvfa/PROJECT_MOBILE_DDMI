import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Card, Text, TextInput } from "react-native-paper";
import React, { useState } from "react";
import firebase from '../services/connectionFirebase';
import logo from '../../assets/Smooth.png';

export default function Login({ changeStatus }) {
  const [type, setType] = useState("login");
  const [name, setName] = useState("");
  const ProductType = [
    { id: 'camiseta', nome: 'Camiseta', icone: 'tshirt-crew' },
    { id: 'calca', nome: 'Calça', icone: 'seat-legroom-normal' },
    { id: 'calcado', nome: 'Calçado', icone: 'shoe-sneaker' },
    { id: 'acessorio', nome: 'Acessório', icone: 'watch' },
    { id: 'outro', nome: 'Outro', icone: 'package-variant-closed' }
  ];
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [characteristics, setcharacteristics] = useState("");



  function validateEmail(email) {
    if (!email.includes('@')) {
      setEmailError("Falta @ no email");
      return false;
    }
    if (!email.includes('.com')) {
      setEmailError("Falta .com no email");
      return false;
    }
    if (email !== email.toLowerCase()) {
      setEmailError("Email deve conter apenas letras minúsculas");
      return false;
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validatePassword(password) {
    const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
    const upperCase = /[A-Z]/;
    const lowerCase = /[a-z]/;
    const numbers = /[0-9]/;

    if (!specialChars.test(password)) {
      setPasswordError("A senha deve conter pelo menos um caractere especial");
      return false;
    }
    if (!upperCase.test(password)) {
      setPasswordError("A senha deve conter pelo menos uma letra maiúscula");
      return false;
    }
    if (!lowerCase.test(password)) {
      setPasswordError("A senha deve conter pelo menos uma letra minúscula");
      return false;
    }
    if (!numbers.test(password)) {
      setPasswordError("A senha deve conter pelo menos um número");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres");
      return false;
    }
    return true;
  }

  function handleLogin() {
    if (!validateEmail(email)) {
      return;
    }

    if (!validatePassword(password)) {
      return;
    }

    if (type === 'login') {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
          changeStatus(user.user.uid);
        })
        .catch((err) => {
          console.log(err);
          if (err.code === 'auth/user-not-found') {
            setEmailError("Email não cadastrado");
          } else {
            alert('Email ou senha incorretos!');
          }
        });
    } else {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
          changeStatus(user.user.uid);
        })
        .catch((err) => {
          console.log(err);
          alert('Erro ao Cadastrar!');
        });
    }
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            style={styles.input}
            mode="outlined"
            label="Nome"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setNameError("");
            }}
            onFocus={() => setFocusedField("name")}
            onBlur={() => setFocusedField(null)}
            theme={{
              colors: {
                primary: focusedField === "name" ? "black" : "#4682B4",
                text: focusedField === "name" ? "black" : "gray",
              },
            }}
            error={!!nameError}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          <TextInput
            style={styles.input}
            mode="outlined"
            label="Senha"
            secureTextEntry
            maxLength={30}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError("");
            }}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            theme={{
              colors: {
                primary: focusedField === "password" ? "black" : "#4682B4",
                text: focusedField === "password" ? "black" : "gray",
              },
            }}
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </Card.Content>
      </Card>

      <TouchableOpacity
        style={[
          styles.colorButton,
          { backgroundColor: type === 'login' ? '#000000' : '#FF0000' },
        ]}
        onPress={handleLogin}
      >
        <Text style={styles.loginText}>
          {type === 'login' ? 'Acessar' : 'Cadastrar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setType((type) => (type === 'login' ? 'cadastrar' : 'login'))}
      >
        <Text style={styles.switchText}>
          {type === 'login' ? 'Criar uma conta' : 'Já possuo uma conta'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 250,
    marginBottom: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
  colorButton: {
    width: "100%",
    maxWidth: 400,
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  loginText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  switchText: {
    marginTop: 10,
    fontSize: 16,
    color: "#4682B4",
    fontWeight: "bold",
  },
});
