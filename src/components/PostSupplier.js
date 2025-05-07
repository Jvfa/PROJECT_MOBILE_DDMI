import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, Keyboard, ActivityIndicator, FlatList } from "react-native";
import { Card, Text, TextInput, Button, Provider } from "react-native-paper";
import React, { useState, useRef, useEffect } from "react";
import firebase from '../services/connectionFirebase';
import ListSuppliers from "./listSupplier";

export default function PostSupplier({ changeStatus }) {
  const [corporateName, setCorporateName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [key, setKey] = useState('');
  const [errors, setErrors] = useState({});
  //array dos dados a serem listados
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const inputRef = useRef(null);

  const validateFields = () => {
    let tempErrors = {};

    if (corporateName === '') tempErrors.corporateName = 'Razão Social é obrigatória';
    if (cnpj === '') tempErrors.cnpj = 'CNPJ é obrigatório';
    else if (cnpj.length !== 18) tempErrors.cnpj = 'CNPJ deve ter 14 dígitos';
    if (email === '') tempErrors.email = 'E-mail é obrigatório';
    else if (!/^\S+@\S+\.\S+$/.test(email)) tempErrors.email = 'E-mail inválido';
    if (phone === '') tempErrors.phone = 'Telefone é obrigatório';
    else if (phone.length < 14) tempErrors.phone = 'Telefone inválido';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleCnpjChange = (text) => {
    // Remove tudo que não for número
    const numericValue = text.replace(/\D/g, '');
    
    if (numericValue === '') {
      setCnpj('');
      return;
    }
    
    // Formata o CNPJ: XX.XXX.XXX/XXXX-XX
    let formattedCnpj = numericValue;
    if (numericValue.length > 2) {
      formattedCnpj = numericValue.substring(0, 2) + '.' + numericValue.substring(2);
    }
    if (numericValue.length > 5) {
      formattedCnpj = formattedCnpj.substring(0, 6) + '.' + formattedCnpj.substring(6);
    }
    if (numericValue.length > 8) {
      formattedCnpj = formattedCnpj.substring(0, 10) + '/' + formattedCnpj.substring(10);
    }
    if (numericValue.length > 12) {
      formattedCnpj = formattedCnpj.substring(0, 15) + '-' + formattedCnpj.substring(15);
    }
    
    setCnpj(formattedCnpj.substring(0, 18));
  };

  const handlePhoneChange = (text) => {
    // Remove tudo que não for número
    const numericValue = text.replace(/\D/g, '');
    
    if (numericValue === '') {
      setPhone('');
      return;
    }

    // Formata o telefone: (XX) XXXXX-XXXX
    let formattedPhone = numericValue;
    if (numericValue.length > 0) {
      formattedPhone = '(' + numericValue.substring(0, 2);
    }
    if (numericValue.length > 2) {
      formattedPhone += ') ' + numericValue.substring(2, 7);
    }
    if (numericValue.length > 7) {
      formattedPhone += '-' + numericValue.substring(7);
    }
    
    setPhone(formattedPhone.substring(0, 15));
  };

  async function insert() {
    if (!validateFields()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios corretamente');
      return;
    }

    // Se tiver uma key, é uma edição
    if (key !== '') {
      firebase.database().ref('suppliers').child(key).update({
        corporateName: corporateName,
        cnpj: cnpj,
        email: email,
        phone: phone
      });
      Keyboard.dismiss();
      alert('Fornecedor Editado!');
      clearFields();
      setKey('');
      return;
    }

    // Caso contrário é um novo cadastro
    let supplierRef = await firebase.database().ref('suppliers');
    let chave = supplierRef.push().key;

    supplierRef.child(chave).set({
      corporateName: corporateName,
      cnpj: cnpj,
      email: email,
      phone: phone
    });
    Keyboard.dismiss();
    alert('Fornecedor Cadastrado!');
    clearFields();
  }

  function clearFields() {
    setCorporateName('');
    setCnpj('');
    setEmail('');
    setPhone('');
    setErrors({});
  }

  function handleEdit(data){
    setKey(data.key);
    setCorporateName(data.corporateName);
    setCnpj(data.cnpj);
    setEmail(data.email);
    setPhone(data.phone);
  }

  function handleDelete(key) {
    firebase.database().ref('suppliers').child(key).remove()
      .then(() => {
        const findSuppliers = suppliers.filter(item => item.key !== key)
        setSuppliers(findSuppliers)
        alert('Fornecedor Excluído!');
      })
  }

  useEffect(() => {
    async function dados() {
      await firebase.database().ref('suppliers').on('value', (snapshot) => {
        setSuppliers([]);

        snapshot.forEach((chilItem) => {
          let data = {
            key: chilItem.key,
            corporateName: chilItem.val().corporateName,
            cnpj: chilItem.val().cnpj,
            email: chilItem.val().email,
            phone: chilItem.val().phone,
          };
          setSuppliers(oldArray => [...oldArray, data].reverse());
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
              <Text style={styles.title}>Cadastrar Fornecedor</Text>

              <TextInput
                label="Razão Social"
                value={corporateName}
                onChangeText={text => setCorporateName(text)}
                mode="outlined"
                style={styles.input}
                error={!!errors.corporateName}
                theme={{ colors: { primary: '#000', text: '#000', placeholder: '#000' } }}
                outlineColor="#999"
                ref={inputRef}
              />
              {errors.corporateName && <Text style={styles.errorText}>{errors.corporateName}</Text>}

              <TextInput
                label="CNPJ"
                value={cnpj}
                onChangeText={handleCnpjChange}
                mode="outlined"
                style={styles.input}
                keyboardType="numeric"
                error={!!errors.cnpj}
                placeholder="XX.XXX.XXX/XXXX-XX"
                theme={{ colors: { primary: '#000', text: '#000', placeholder: '#000' } }}
                outlineColor="#999"
                maxLength={18}
                ref={inputRef}
              />
              {errors.cnpj && <Text style={styles.errorText}>{errors.cnpj}</Text>}

              <TextInput
                label="E-mail"
                value={email}
                onChangeText={text => setEmail(text)}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                error={!!errors.email}
                theme={{ colors: { primary: '#000', text: '#000', placeholder: '#000' } }}
                outlineColor="#999"
                ref={inputRef}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <TextInput
                label="Telefone"
                value={phone}
                onChangeText={handlePhoneChange}
                mode="outlined"
                style={styles.input}
                keyboardType="numeric"
                error={!!errors.phone}
                placeholder="(XX) XXXXX-XXXX"
                theme={{ colors: { primary: '#000', text: '#000', placeholder: '#000' } }}
                outlineColor="#999"
                maxLength={15}
                ref={inputRef}
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

              <Button
                mode="contained"
                style={styles.button}
                labelStyle={styles.buttonLabel}
                onPress={insert}
              >
                CADASTRAR FORNECEDOR
              </Button>
              {loading ?
                (
                  <ActivityIndicator color="#141414" size={45} />
                ) :
                (
                  <FlatList
                    keyExtractor={item => item.key}
                    data={suppliers}
                    renderItem={({ item }) => (
                      <ListSuppliers data={item} deleteItem={handleDelete}
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