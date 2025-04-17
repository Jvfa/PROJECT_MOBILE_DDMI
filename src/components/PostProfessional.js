import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, Keyboard } from "react-native";
import { Card, Text, TextInput, Button, Menu, Provider } from "react-native-paper";
import React, { useState, useRef } from "react";
import firebase from '../services/connectionFirebase';

export default function PostProfessional({ changeStatus }) {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('camisa');
  const [cor, setCor] = useState('preto');
  const [preco, setPreco] = useState('');
  const [caracteristicas, setCaracteristicas] = useState('');
  const [key, setKey] = useState('');
  const [visibleMenu, setVisibleMenu] = useState(false);
  const [visibleColorMenu, setVisibleColorMenu] = useState(false);
  const [errors, setErrors] = useState({});

  const tipoAnchorRef = useRef(null);
  const corAnchorRef = useRef(null);

  const produtoTipos = ['Calça', 'Camiseta', 'Camisa', 'Acessórios', 'Sapato', 'Outros'];
  const produtoCores = ['Preto', 'Branco', 'Azul', 'Vermelho', 'Verde', 'Amarelo', 'Roxo', 'Rosa', 'Marrom', 'Cinza', 'Laranja', 'Bege'];

  const validateFields = () => {
    let tempErrors = {};

    if (nome === '') tempErrors.nome = 'Nome do produto é obrigatório';
    if (tipo === '') tempErrors.tipo = 'Tipo do produto é obrigatório';
    if (cor === '') tempErrors.cor = 'Cor do produto é obrigatória';
    if (preco === '') tempErrors.preco = 'Preço do produto é obrigatório';
    if (caracteristicas === '') tempErrors.caracteristicas = 'Características do produto são obrigatórias';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handlePriceChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');

    if (numericValue === '') {
      setPreco('');
      return;
    }

    const decimalValue = (parseInt(numericValue) / 100).toFixed(2);
    setPreco(decimalValue.replace('.', ','));
  };

  async function insert() {
    if (!validateFields()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    // Se tiver uma key, é uma edição
    if (key !== '') {
      firebase.database().ref('products').child(key).update({
        name: nome,
        type: tipo,
        color: cor,
        price: preco,
        characteristics: caracteristicas
      });
      Keyboard.dismiss();
      alert('Produto Editado!');
      clearFields();
      setKey('');
      return;
    }

    // Caso contrário é um novo cadastro
    let gelatosA = await firebase.database().ref('products');
    let chave = gelatosA.push().key;

    gelatosA.child(chave).set({
      name: nome,
      type: tipo,
      color: cor,
      price: preco,
      characteristics: caracteristicas
    });
    Keyboard.dismiss();
    alert('Produto Cadastrado!');
    clearFields();
  }

  function clearFields() {
    setNome('');
    setTipo('');
    setCor('');
    setPreco('');
    setCaracteristicas('');
    setErrors({});
  }

  return (
    <Provider>
      <ScrollView>
        <View style={styles.container}>
          <Card style={styles.card}>
            <Card.Title title="Profissional" titleStyle={styles.cardTitle} />
            <Card.Content>
              <Text style={styles.title}>Cadastrar Produto</Text>

              <TextInput
                label="Nome do produto"
                value={nome}
                onChangeText={text => setNome(text)}
                mode="outlined"
                style={styles.input}
                error={!!errors.nome}
                theme={{ colors: { primary: '#000', text: '#000', placeholder: '#000' } }}
                outlineColor="#999"
              />
              {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}

              <Menu
                visible={visibleMenu}
                onDismiss={() => setVisibleMenu(false)}
                anchor={
                  <TouchableOpacity onPress={() => setVisibleMenu(true)} style={styles.dropdownStyle}>
                    <Text style={tipo ? styles.dropdownText : styles.placeholder}>
                      {tipo || "Tipo do produto"}
                    </Text>
                  </TouchableOpacity>
                }
              >
                {produtoTipos.map((item) => (
                  <Menu.Item
                    key={item}
                    onPress={() => {
                      setTipo(item);
                      setVisibleMenu(false);
                    }}
                    title={item}
                  />
                ))}
              </Menu>
              {errors.tipo && <Text style={styles.errorText}>{errors.tipo}</Text>}

              <Menu
                visible={visibleColorMenu}
                onDismiss={() => setVisibleColorMenu(false)}
                anchor={
                  <TouchableOpacity onPress={() => setVisibleColorMenu(true)} style={styles.dropdownStyle}>
                    <Text style={cor ? styles.dropdownText : styles.placeholder}>
                      {cor || "Cor do produto"}
                    </Text>
                  </TouchableOpacity>
                }
              >
                {produtoCores.map((item) => (
                  <Menu.Item
                    key={item}
                    onPress={() => {
                      setCor(item);
                      setVisibleColorMenu(false);
                    }}
                    title={item}
                  />
                ))}
              </Menu>
              {errors.cor && <Text style={styles.errorText}>{errors.cor}</Text>}

              <TextInput
                label="Preço do produto"
                value={preco}
                onChangeText={handlePriceChange}
                mode="outlined"
                style={styles.input}
                keyboardType="numeric"
                error={!!errors.preco}
                placeholder="0,00"
                theme={{ colors: { primary: '#000', text: '#000', placeholder: '#000' } }}
                outlineColor="#999"
              />
              {errors.preco && <Text style={styles.errorText}>{errors.preco}</Text>}

              <TextInput
                label="Características do produto"
                value={caracteristicas}
                onChangeText={text => setCaracteristicas(text)}
                mode="outlined"
                style={styles.input}
                multiline
                numberOfLines={3}
                theme={{ colors: { primary: '#000', text: '#000', placeholder: '#000' } }}
                outlineColor="#999"
                error={!!errors.caracteristicas}
              />
              {errors.caracteristicas && <Text style={styles.errorText}>{errors.caracteristicas}</Text>}

              <Button
                mode="contained"
                style={styles.button}
                labelStyle={styles.buttonLabel}
                onPress={insert}
              >
                CADASTRAR PRODUTO
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  card: {
    margin: 16,
    elevation: 4,
    backgroundColor: 'white',
  },
  cardTitle: {
    fontWeight: 'bold',
    color: '#000',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  dropdownStyle: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 4,
    padding: 15,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  placeholder: {
    fontSize: 16,
    color: '#000',
  },
  button: {
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 8,
    backgroundColor: '#000000',
  },
  buttonLabel: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  }
});