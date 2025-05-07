import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, Keyboard, ActivityIndicator, FlatList } from "react-native";
import { Card, Text, TextInput, Button, Menu, Provider } from "react-native-paper";
import React, { useState, useRef, useEffect } from "react";
import firebase from '../services/connectionFirebase';
import ListProdutos from "./listProdutos";

export default function PostProdutos({ changeStatus }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('Camisa');
  const [color, setColor] = useState('Preto');
  const [price, setPrice] = useState('');
  const [characteristics, setCharacteristics] = useState('');
  const [key, setKey] = useState('');
  const [visibleMenu, setVisibleMenu] = useState(false);
  const [visibleColorMenu, setVisibleColorMenu] = useState(false);
  const [errors, setErrors] = useState({});
  //array dos dados a serem listados
  const [loading, setLoading] = useState(true);
  const [produtoA, setProdutoA] = useState([]);
  const inputRef = useRef(null);


  const produtotypes = ['Calça', 'Camiseta', 'Camisa', 'Acessórios', 'Sapato', 'Outros'];
  const produtocolores = ['Preto', 'Branco', 'Azul', 'Vermelho', 'Verde', 'Amarelo', 'Roxo', 'Rosa', 'Marrom', 'Cinza', 'Laranja', 'Bege'];

  const validateFields = () => {
    let tempErrors = {};

    if (name === '') tempErrors.name = 'nome do produto é obrigatório';
    if (type === '') tempErrors.type = 'type do produto é obrigatório';
    if (color === '') tempErrors.color = 'color do produto é obrigatória';
    if (price === '') tempErrors.price = 'Preço do produto é obrigatório';
    if (characteristics === '') tempErrors.characteristics = 'Características do produto são obrigatórias';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handlePriceChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');

    if (numericValue === '') {
      setPrice('');
      return;
    }

    const decimalValue = (parseInt(numericValue) / 100).toFixed(2);
    setPrice(decimalValue.replace('.', ','));
  };

  async function insert() {
    if (!validateFields()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Se tiver uma key, é uma edição
    if (key !== '') {
      firebase.database().ref('products').child(key).update({
        name: name,
        type: type,
        color: color,
        price: price,
        characteristics: characteristics
      });
      Keyboard.dismiss();
      alert('Produto Editado!');
      clearFields();
      setKey('');
      return;
    }

    // Caso contrário é um novo cadastro
    let produtoA = await firebase.database().ref('products');
    let chave = produtoA.push().key;

    produtoA.child(chave).set({
      name: name,
      type: type,
      color: color,
      price: price,
      characteristics: characteristics
    });
    Keyboard.dismiss();
    alert('Produto Cadastrado!');
    clearFields();
  }

  function clearFields() {
    setName('');
    setType('');
    setColor('');
    setPrice('');
    setCharacteristics('');
    setErrors({});
  }

  function handleEdit(data){
    setKey(data.key);
    setName(data.name);
    setType(data.type);
    setColor(data.color);
    setPrice(data.price);
    setCharacteristics(data.characteristics);
  }

  function handleDelete(key) {
    firebase.database().ref('products').child(key).remove()
      .then(() => {
        const findProducts = products.filter(item => item.key !== key)
        setGelatos(findProducts)
      })
    alert('Produto Excluído!');
  }

  useEffect(() => {

    async function dados() {

      await firebase.database().ref('products').on('value', (snapshot) => {
        setProdutoA([]);

        snapshot.forEach((chilItem) => {
          let data = {
            key: chilItem.key,
            name: chilItem.val().name,
            type: chilItem.val().type,
            color: chilItem.val().color,
            price: chilItem.val().price,
            characteristics: chilItem.val().characteristics,
          };
          setProdutoA(oldArray => [...oldArray, data].reverse());
        })
        setLoading(false);
      })
    }
    dados();
  }, []);

  return (
    <Provider>
      <ScrollView>
        <View style={styles.container}>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>Cadastrar Produto</Text>

              <TextInput
                label="Nome do produto"
                value={name}
                onChangeText={text => setName(text)}
                mode="outlined"
                style={styles.input}
                error={!!errors.name}
                theme={{ colors: { primary: '#000', text: '#000', placeholder: '#000' } }}
                outlineColor="#999"
                ref={inputRef}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

              <Menu
                visible={visibleMenu}
                onDismiss={() => setVisibleMenu(false)}
                anchor={
                  <TouchableOpacity onPress={() => setVisibleMenu(true)} style={styles.dropdownStyle}>
                    <Text style={type ? styles.dropdownText : styles.placeholder}>
                      {type || "Tipo do produto"}
                    </Text>
                  </TouchableOpacity>
                }
              >
                {produtotypes.map((item) => (
                  <Menu.Item
                    key={item}
                    onPress={() => {
                      setType(item);
                      setVisibleMenu(false);
                    }}
                    title={item}
                  />
                ))}
              </Menu>
              {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}

              <Menu
                visible={visibleColorMenu}
                onDismiss={() => setVisibleColorMenu(false)}
                anchor={
                  <TouchableOpacity onPress={() => setVisibleColorMenu(true)} style={styles.dropdownStyle}>
                    <Text style={color ? styles.dropdownText : styles.placeholder}>
                      {color || "Cor do produto"}
                    </Text>
                  </TouchableOpacity>
                }
              >
                {produtocolores.map((item) => (
                  <Menu.Item
                    key={item}
                    onPress={() => {
                      setColor(item);
                      setVisibleColorMenu(false);
                    }}
                    title={item}
                  />
                ))}
              </Menu>
              {errors.color && <Text style={styles.errorText}>{errors.color}</Text>}

              <TextInput
                label="Preço do produto"
                value={price}
                onChangeText={handlePriceChange}
                mode="outlined"
                style={styles.input}
                keyboardType="numeric"
                error={!!errors.price}
                placeholder="0,00"
                theme={{ colors: { primary: '#000', text: '#000', placeholder: '#000' } }}
                outlineColor="#999"
                ref={inputRef}
              />
              {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

              <TextInput
                label="Características do produto"
                value={characteristics}
                onChangeText={text => setCharacteristics(text)}
                mode="outlined"
                style={styles.input}
                multiline
                numberOfLines={3}
                theme={{ colors: { primary: '#000', text: '#000', placeholder: '#000' } }}
                outlineColor="#999"
                error={!!errors.characteristics}
                ref={inputRef}
              />
              {errors.characteristics && <Text style={styles.errorText}>{errors.characteristics}</Text>}

              <Button
                mode="contained"
                style={styles.button}
                labelStyle={styles.buttonLabel}
                onPress={insert}
              >
                CADASTRAR PRODUTO
              </Button>
              {loading ?
                (
                  <ActivityIndicator color="#141414" size={45} />
                ) :
                (
                  <FlatList
                    keyExtractor={item => item.key}
                    data={produtoA}
                    renderItem={({ item }) => (
                      <ListProdutos data={item} deleteItem={handleDelete}
                        editItem={handleEdit} />
                    )}
                  />
                )
              }
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