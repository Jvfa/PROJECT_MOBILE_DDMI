import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesome } from '@expo/vector-icons';

export default function ListSuppliers({ data, deleteItem, editItem }) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Razão Social: {data.corporateName}</Text>
            <Text style={styles.text}>CNPJ: {data.cnpj}</Text>
            <Text style={styles.text}>E-mail: {data.email}</Text>
            <Text style={styles.text}>Telefone: {data.phone}</Text>
            <View style={styles.item}>
                <TouchableOpacity onPress={() => editItem(data)}>
                    <Icon name="pencil" color="blue" size={20}>Editar</Icon>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteItem(data.key)}>
                    <Icon name="trash-o" color="#A52A2A" size={20}>Excluir</Icon>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        marginBottom: 5,
        padding: 20,
        backgroundColor: '#D6E2E1',
        paddingTop: 22,
        borderWidth: 0.5,
        borderColor: '#20232a',
        fontWeight: 'bold'
    },
    text: {
        color: 'black',
        fontSize: 17
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        fontSize: 18,
        height: 20
    }
});