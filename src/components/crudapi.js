import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather'; // Ícones modernos

const API_URL = 'https://682e52db746f8ca4a47c9aab.mockapi.io/api/v1/users'; // Substitua com seu endpoint

export default function CrudApi() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [image, setImage] = useState('');

    useEffect(() => {
        searchUsers();
    }, []);

    const searchUsers = async () => {
        try {
            const response = await axios.get(API_URL);
            setUsers(response.data);
        } catch (error) {
            console.error('Erro ao buscar usuários', error);
            alert('Lista de Usuários vazia');
        }
    };

    const handleCreate = async () => {
        try {
            const newUser = { name, age, gender, address, image };
            await axios.post(API_URL, newUser);
            searchUsers();
            alert('Usuário Inserido com Sucesso!')
            clearFields();
        } catch (error) {
            console.error('Erro ao criar usuário', error);
        }
    };

    //carregar para exibir os dados nos TextInput
    const handleLoad = (user) => {
        setName(user.name);
        setAge(user.age);
        setGender(user.gender);
        setAddress(user.address);
        setEditingUser(user);
        setImage(user.image);
    };

    const handleUpdate = async () => {
        try {
            const updatedUser = { name, age, gender, address, image };
            await axios.put(`${API_URL}/${editingUser.id}`, updatedUser);
            searchUsers();
            alert('Dados do Usuário Alterado com Sucesso!')
            clearFields();
            setEditingUser(null);
        } catch (error) {
            console.error('Erro ao atualizar usuário', error);
        }
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`${API_URL}/${userId}`);
            searchUsers();
        } catch (error) {
            console.error('Erro ao deletar usuário', error);
        }
    };

    function clearFields() {
        setName('');
        setAge('');
        setGender('');
        setAddress('');
        setImage('');
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cadastro de Usuários</Text>

            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Usuário"
                style={styles.input}
            />
            <TextInput
                value={age}
                onChangeText={setAge}
                placeholder="Idade"
                style={styles.input}
            />
            <TextInput
                value={gender}
                onChangeText={setGender}
                placeholder="Gênero"
                style={styles.input}
            />
            <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="Endereço"
                style={styles.input}
            />

            <TextInput
                value={image}
                onChangeText={setImage}
                placeholder="URL da Imagem"
                style={styles.input}
            />

            <Button
                title={editingUser ? 'Atualizar Usuário' : 'Adicionar Usuário'}
                onPress={editingUser ? handleUpdate : handleCreate}
                color="#007AFF"
            />

            <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                style={{ marginTop: 20 }}
                renderItem={({ item }) => (
                    <View style={styles.userItem}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.name}>Nome: {item.name}</Text>
                            <Text style={styles.address}>Endereço: {item.address}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleLoad(item)} style={styles.iconButton}>
                            <Icon name="edit" size={20} color="#007AFF" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconButton}>
                            <Icon name="trash-2" size={20} color="#FF3B30" />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#fff',
        flex: 1,
    },
    title: {
        fontSize: 28,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        borderColor: '#e0e0e0',
        borderWidth: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    address: {
        color: '#555',
    },
    iconButton: {
        padding: 6,
        marginLeft: 10,
    },
});