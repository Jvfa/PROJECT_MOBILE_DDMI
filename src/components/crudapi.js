import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather'; // Ícones modernos

const API_URL = 'https://682e52bd746f8ca4a47c99bc.mockapi.io/orders'; // Substitua com seu endpoint

export default function CrudApi() {
    const [Orders, setOrders] = useState([]);
    const [customerId, setCustomerId] = useState('');
    const [orderdate, setOrderdate] = useState('');
    const [cardnumber, setCardnumber] = useState('');
    const [customername, setCustomername] = useState('');
    const [ordername, setOrdername] = useState('');
    const [editingOrders, setEditingOrders] = useState(null);

    useEffect(() => {
        searchOrders();
    }, []);

    const searchOrders = async () => {
        try {
            const response = await axios.get(API_URL);
            setOrders(response.data);
        } catch (error) {
            console.error('Erro ao buscar Pedidos', error);
            alert('Nenhum pedido cadastrado');
        }
    };

    const handleCreate = async () => {
        try {
            const newOrders = { customerId, orderdate, cardnumber, customername, ordername };
            await axios.post(API_URL, newOrders);
            searchOrders();
            setCustomerId('');
            setOrderdate('');
            setCardnumber('');
            setCustomername('');
            setOrdername('');
            alert('Pedido Inserido com Sucesso!')
            setEditingOrders('');
        } catch (error) {
            console.error('Erro ao criar Pedido', error);
        }
    };

    //carregar para exibir os dados nos TextInput
    const handleLoad = (order) => {
        setCustomerId(order.customerId);
        setOrderdate(order.orderdate);
        setCardnumber(order.cardnumber);
        setCustomername(order.customername);
        setOrdername(order.ordername);
        setEditingOrders(order);
    };

    const handleUpdate = async () => {
        try {
            const updatedOrder = { customerId, orderdate, cardnumber, customername, ordername };
            await axios.put(`${API_URL}/${editingOrder.id}`, updatedOrder);
            searchOrders();
            alert('Pedido Alterado com Sucesso!')
            clearFields();
            setEditingOrders(null);
        } catch (error) {
            console.error('Erro ao atualizar Pedido', error);
        }
    };

    const handleDelete = async (Id) => {
        try {
            await axios.delete(`${API_URL}/${Id}`);
            SearchOrders();
        } catch (error) {
            console.error('Erro ao deletar Pedido', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cadastro de Pedidos</Text>

            <TextInput
                value={ordername}
                onChangeText={setOrdername}
                placeholder="Nome do Pedido"
                style={styles.input}
            />

            <TextInput
                value={customername}
                onChangeText={setCustomername}
                placeholder="Nome do Cliente"
                style={styles.input}
            />
            <TextInput
                value={cardnumber}
                onChangeText={setCardnumber}
                placeholder="Cartão de Debito/Credito"
                style={styles.input}
            />
            <TextInput
                value={orderdate}
                onChangeText={setOrderdate}
                placeholder="Data do Pedido"
                style={styles.input}
            />

            <Button
                title={editingOrders ? 'Atualizar Pedido' : 'Adicionar Pedido'}
                onPress={editingOrders ? handleUpdate : handleCreate}
                color="#007AFF"
            />

            <FlatList
                data={Orders}
                keyExtractor={(item) => item.id.toString()}
                style={{ marginTop: 20 }}
                renderItem={({ item }) => (
                    <View style={styles.userItem}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.ordername}>Nome: {item.ordername}</Text>
                            <Text style={styles.customername}>Cliente: {item.customername}</Text>
                            <Text style={styles.cardnumber}>Cliente: {item.cardnumber}</Text>
                            <Text style={styles.orderdate}>Cliente: {item.orderdate}</Text>
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
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    userEmail: {
        color: '#555',
    },
    iconButton: {
        padding: 6,
        marginLeft: 10,
    },
});