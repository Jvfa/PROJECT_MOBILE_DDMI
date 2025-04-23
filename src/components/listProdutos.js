import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
 
export default function ListProdutos({ data, deleteItem, editItem }) {
    return (
<View style={styles.container}>
<Text style={styles.text}>Nome: {data.name}</Text>
<Text style={styles.text}>Tipo {data.type}</Text>
<Text style={styles.text}>Cor: {data.color}</Text>
<Text style={styles.text}>Preço(R$): {data.price}</Text>
<Text style={styles.text}>caracteristicas: {data.characteristics}</Text>
<View style={styles.item}>
<TouchableOpacity onPress={() => editItem(data)}>
<Icon name="pencil" color="blue" size={20}>Editar</Icon>
</TouchableOpacity>
<TouchableOpacity onPress={() => deleteItem(data.key)}>
<Icon name="trash-o" color="#A52A2A" size={20}>Excluir</Icon>
</TouchableOpacity>
</View>
</View>
 
    )
 
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