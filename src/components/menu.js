import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import PostProdutos from "./PostProdutos";
import PostSupplier from './PostSupplier'; 

function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text></Text>
        </View>
    );
}
 
 
function ListScreen() {
    return (
        <View style={styles.container}>
            <Text></Text>
        </View>
    );
}
 
function Produtos() {
    return <PostProdutos/>
}

function Fornecedores() {
    return <PostSupplier/>
}
 
function APIScreen() {
    return (
        <View style={styles.container}>
            <Text></Text>
        </View>
    );
}
 
const Tab = createBottomTabNavigator();
 
export default function Menu() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName;
                        switch (route.name) {
                            case 'Home':
                                iconName = 'home';
                                break;
                            case 'Listar':
                                iconName = 'list';
                                break;
                            case 'Produtos':
                                iconName = 'inbox';
                                break;
                            case 'Fornecedores':
                                iconName = 'group';
                                break;
                            case 'Ler API':
                                iconName = 'android';
                                break;
                            default:
                                iconName = 'bomb';
                                break;
                        }
                        return <Icon name={iconName} size={size} color={color} />;
                    },
                tabBarActiveTintColor: '#000000',
                tabBarInactiveTintColor: '#C0C0C0',
                showLabel: true,
                })}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Listar" component={ListScreen} />
                <Tab.Screen name="Produtos" component={Produtos} />
                <Tab.Screen name="Fornecedores" component={Fornecedores}/>
                <Tab.Screen name="Ler API" component={APIScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconTabRound: {
        color: '#006400',
        width: 100,
        height: 90,
        borderRadius: 30,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    }
});