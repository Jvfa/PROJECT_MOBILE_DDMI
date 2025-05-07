import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ListProdutos({ data, deleteItem, editItem }) {
    // Função para confirmar exclusão
    const confirmDelete = (key) => {
        // Para plataformas móveis usando React Native
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
            Alert.alert(
                'Confirmar exclusão',
                'Deseja realmente excluir este registro?',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Excluir',
                        onPress: () => deleteItem(key),
                        style: 'destructive',
                    },
                ],
                { cancelable: true }
            );
        } else {
            // Para ambiente web
            if (window.confirm('Deseja realmente excluir este registro?')) {
                deleteItem(key);
            }
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.infoBlock}>
                <Text style={styles.label}>Nome</Text>
                <Text style={styles.text}>{data.name}</Text>

                <Text style={styles.label}>Tipo</Text>
                <Text style={styles.text}>{data.type}</Text>

                <Text style={styles.label}>Cor</Text>
                <Text style={styles.text}>{data.color}</Text>

                <Text style={styles.label}>Preço (R$)</Text>
                <Text style={styles.text}>{data.price}</Text>

                <Text style={styles.label}>Características</Text>
                <Text style={styles.text}>{data.characteristics}</Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity onPress={() => editItem(data)} style={styles.iconButton}>
                    <Icon name="pencil" color="#007AFF" size={18} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDelete(data.key)} style={styles.iconButton}>
                    <Icon name="trash-o" color="#FF3B30" size={18} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#F7FAFC',
        borderRadius: 16,
        padding: 20,
        marginVertical: 12,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    infoBlock: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        color: '#718096',
        marginTop: 8,
    },
    text: {
        fontSize: 16,
        color: '#2D3748',
        fontWeight: '500',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    iconButton: {
        backgroundColor: '#EDF2F7',
        padding: 10,
        borderRadius: 10,
        marginLeft: 12,
    },
});