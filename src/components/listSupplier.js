import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ListSuppliers({ data, deleteItem, editItem }) {
    return (
        <View style={styles.card}>
            <View style={styles.infoBlock}>
                <Text style={styles.label}>Razão Social</Text>
                <Text style={styles.text}>{data.corporateName}</Text>

                <Text style={styles.label}>CNPJ</Text>
                <Text style={styles.text}>{data.cnpj}</Text>

                <Text style={styles.label}>E-mail</Text>
                <Text style={styles.text}>{data.email}</Text>

                <Text style={styles.label}>Telefone</Text>
                <Text style={styles.text}>{data.phone}</Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity onPress={() => editItem(data)} style={styles.iconButton}>
                    <Icon name="pencil" color="#007AFF" size={18} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteItem(data.key)} style={styles.iconButton}>
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
