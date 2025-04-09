import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Card, Text, TextInput, Button, Menu, Provider } from "react-native-paper";
import React, { useState } from "react";

export default function PostProfessional({ changeStatus }) {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [cor, setCor] = useState('');
  const [preco, setPreco] = useState('');
  const [caracteristicas, setCaracteristicas] = useState('');
  const [visibleMenu, setVisibleMenu] = useState(false);
  const [visibleColorMenu, setVisibleColorMenu] = useState(false);
  const [errors, setErrors] = useState({});

  const produtoTipos = ['Calça', 'Camiseta', 'Camisa', 'Acessórios', 'Sapato', 'Outros'];
  const produtoCores = ['Preto', 'Branco', 'Azul', 'Vermelho', 'Verde', 'Amarelo', 'Roxo', 'Rosa', 'Marrom', 'Cinza', 'Laranja', 'Bege'];

  const validateFields = () => {
    let tempErrors = {};
    
    if (nome === '') tempErrors.nome = 'Nome do produto é obrigatório';
    if (tipo === '') tempErrors.tipo = 'Tipo do produto é obrigatório';
    if (cor === '') tempErrors.cor = 'Cor do produto é obrigatória';
    if (preco === '') tempErrors.preco = 'Preço do produto é obrigatório';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Price mask function to only allow numbers and format as currency
  const handlePriceChange = (text) => {
    // Remove any non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');
    
    if (numericValue === '') {
      setPreco('');
      return;
    }
    
    // Convert to decimal value (divide by 100 to handle cents)
    const decimalValue = (parseInt(numericValue) / 100).toFixed(2);
    
    // Format as currency
    setPreco(decimalValue.replace('.', ','));
  };

  const cadastrarProduto = () => {
    if (validateFields()) {
      // Mock successful product registration without Firebase
      Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
      limparCampos();
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
    }
  };

  const limparCampos = () => {
    setNome('');
    setTipo('');
    setCor('');
    setPreco('');
    setCaracteristicas('');
    setErrors({});
  };

  return (
    <Provider>
      <ScrollView>
        <View style={styles.container}>
          <Card style={styles.card}>
            <Card.Title 
              title="Profissional" 
              titleStyle={styles.cardTitle} 
            />
            <Card.Content>
              <Text style={styles.title}>Cadastrar Produto</Text>

              <TextInput
                label="Nome do produto"
                value={nome}
                onChangeText={text => setNome(text)}
                mode="outlined"
                style={styles.input}
                error={errors.nome ? true : false}
              />
              {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}

              <Menu
                visible={visibleMenu}
                onDismiss={() => setVisibleMenu(false)}
                anchor={
                  <TouchableOpacity onPress={() => setVisibleMenu(true)}>
                    <View style={styles.dropdownStyle}>
                      <Text style={tipo ? styles.dropdownText : styles.placeholder}>
                        {tipo || "Tipo do produto"}
                      </Text>
                    </View>
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

              {/* Color dropdown menu */}
              <Menu
                visible={visibleColorMenu}
                onDismiss={() => setVisibleColorMenu(false)}
                anchor={
                  <TouchableOpacity onPress={() => setVisibleColorMenu(true)}>
                    <View style={styles.dropdownStyle}>
                      <Text style={cor ? styles.dropdownText : styles.placeholder}>
                        {cor || "Cor do produto"}
                      </Text>
                    </View>
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
                error={errors.preco ? true : false}
                placeholder="0,00"
              />
              {errors.preco && <Text style={styles.errorText}>{errors.preco}</Text>}

              <TextInput
                label="Características do produto (opcional)"
                value={caracteristicas}
                onChangeText={text => setCaracteristicas(text)}
                mode="outlined"
                style={styles.input}
                multiline
                numberOfLines={3}
              />

              <Button 
                mode="contained" 
                style={styles.button}
                onPress={cadastrarProduto}
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
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  dropdownStyle: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 15,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  placeholder: {
    fontSize: 16,
    color: '#757575',
  },
  button: {
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 8,
    backgroundColor: '#000000',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  }
});