import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Image, Alert, Platform } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather';

const API_URL = 'https://682e52bd746f8ca4a47c99bc.mockapi.io/reviews'; // Endpoint para reviews

export default function CrudReviews() {
    const [reviews, setReviews] = useState([]);
    const [grade, setGrade] = useState('');
    const [comment, setComment] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [reviewDate, setReviewDate] = useState('');
    const [image, setImage] = useState('');
    const [editingReview, setEditingReview] = useState(null);

    useEffect(() => {
        searchReviews();
        setCurrentDate();
    }, []);

    const setCurrentDate = () => {
        const now = new Date();
        const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
        setReviewDate(formattedDate);
    };

    const searchReviews = async () => {
        try {
            const response = await axios.get(API_URL);
            setReviews(response.data);
        } catch (error) {
            console.error('Erro ao buscar reviews', error);
            showAlert('Erro', 'Lista de Reviews vazia ou erro na conexão');
        }
    };

    const showAlert = (title, message) => {
        if (Platform.OS === 'web') {
            alert(`${title}: ${message}`);
        } else {
            Alert.alert(title, message);
        }
    };

    const validateInputs = () => {
        if (!customerName.trim()) {
            showAlert('Erro de Validação', 'Nome do cliente é obrigatório');
            return false;
        }
        
        if (customerName.trim().length < 2) {
            showAlert('Erro de Validação', 'Nome do cliente deve ter pelo menos 2 caracteres');
            return false;
        }

        if (!grade || grade < 0 || grade > 5) {
            showAlert('Erro de Validação', 'Nota deve estar entre 0 e 5');
            return false;
        }

        if (!comment.trim()) {
            showAlert('Erro de Validação', 'Comentário é obrigatório');
            return false;
        }

        if (comment.trim().length < 10) {
            showAlert('Erro de Validação', 'Comentário deve ter pelo menos 10 caracteres');
            return false;
        }

        if (!image.trim()) {
            showAlert('Erro de Validação', 'URL da imagem é obrigatória');
            return false;
        }

        // Validação básica de URL
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (!urlPattern.test(image)) {
            showAlert('Erro de Validação', 'URL da imagem inválida');
            return false;
        }

        return true;
    };

    const handleGradeChange = (text) => {
        // Remove caracteres não numéricos e limita a 1 dígito
        const numericText = text.replace(/[^0-5]/g, '');
        if (numericText.length <= 1) {
            setGrade(numericText);
        }
    };

    const handleCustomerNameChange = (text) => {
        // Remove números e caracteres especiais, mantém apenas letras e espaços
        const cleanText = text.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
        if (cleanText.length <= 50) {
            setCustomerName(cleanText);
        }
    };

    const handleCommentChange = (text) => {
        if (text.length <= 500) {
            setComment(text);
        }
    };

    const handleImageChange = (text) => {
        setImage(text.trim());
    };

    const handleCreate = async () => {
        if (!validateInputs()) return;

        try {
            const newReview = { 
                grade: parseInt(grade), 
                comment: comment.trim(), 
                customerName: customerName.trim(), 
                reviewDate, 
                image: image.trim() 
            };
            await axios.post(API_URL, newReview);
            searchReviews();
            showAlert('Sucesso', 'Review inserida com sucesso!');
            clearFields();
        } catch (error) {
            console.error('Erro ao criar review', error);
            showAlert('Erro', 'Erro ao criar review');
        }
    };

    const handleLoad = (review) => {
        setGrade(review.grade.toString());
        setComment(review.comment);
        setCustomerName(review.customerName);
        setReviewDate(review.reviewDate);
        setImage(review.image);
        setEditingReview(review);
    };

    const handleUpdate = async () => {
        if (!validateInputs()) return;

        try {
            const updatedReview = { 
                grade: parseInt(grade), 
                comment: comment.trim(), 
                customerName: customerName.trim(), 
                reviewDate, 
                image: image.trim() 
            };
            await axios.put(`${API_URL}/${editingReview.id}`, updatedReview);
            searchReviews();
            showAlert('Sucesso', 'Review atualizada com sucesso!');
            clearFields();
            setEditingReview(null);
        } catch (error) {
            console.error('Erro ao atualizar review', error);
            showAlert('Erro', 'Erro ao atualizar review');
        }
    };

    const handleDelete = async (reviewId) => {
        const confirmDelete = () => {
            axios.delete(`${API_URL}/${reviewId}`)
                .then(() => {
                    searchReviews();
                    showAlert('Sucesso', 'Review deletada com sucesso!');
                })
                .catch((error) => {
                    console.error('Erro ao deletar review', error);
                    showAlert('Erro', 'Erro ao deletar review');
                });
        };

        if (Platform.OS === 'web') {
            if (window.confirm('Tem certeza que deseja deletar esta review?')) {
                confirmDelete();
            }
        } else {
            Alert.alert(
                'Confirmar Exclusão',
                'Tem certeza que deseja deletar esta review?',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Deletar', style: 'destructive', onPress: confirmDelete }
                ]
            );
        }
    };

    const clearFields = () => {
        setGrade('');
        setComment('');
        setCustomerName('');
        setImage('');
        setCurrentDate();
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Text key={i} style={[styles.star, { color: i <= rating ? '#FFD700' : '#E0E0E0' }]}>
                    ★
                </Text>
            );
        }
        return stars;
    };

    const formatDate = (dateString) => {
        return dateString || 'Data não disponível';
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sistema de Reviews</Text>
            
            <FlatList
                data={reviews}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                    <View>
                        <View style={styles.form}>
                            <View style={styles.row}>
                                <View style={styles.halfWidth}>
                                    <Text style={styles.label}>Nome do Cliente *</Text>
                                    <TextInput
                                        value={customerName}
                                        onChangeText={handleCustomerNameChange}
                                        placeholder="Nome do cliente"
                                        style={styles.input}
                                        maxLength={50}
                                    />
                                </View>
                                <View style={styles.halfWidth}>
                                    <Text style={styles.label}>Nota (0-5) *</Text>
                                    <TextInput
                                        value={grade}
                                        onChangeText={handleGradeChange}
                                        placeholder="0-5"
                                        style={styles.input}
                                        keyboardType="numeric"
                                        maxLength={1}
                                    />
                                </View>
                            </View>

                            <Text style={styles.label}>Comentário *</Text>
                            <TextInput
                                value={comment}
                                onChangeText={handleCommentChange}
                                placeholder="Digite seu comentário (mín. 10 caracteres)"
                                style={[styles.input, styles.textArea]}
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                                maxLength={500}
                            />
                            <Text style={styles.charCount}>{comment.length}/500</Text>

                            <View style={styles.row}>
                                <View style={styles.halfWidth}>
                                    <Text style={styles.label}>Data</Text>
                                    <TextInput
                                        value={reviewDate}
                                        style={[styles.input, styles.dateInput]}
                                        editable={false}
                                    />
                                </View>
                                <View style={styles.halfWidth}>
                                    <Text style={styles.label}>URL Imagem *</Text>
                                    <TextInput
                                        value={image}
                                        onChangeText={handleImageChange}
                                        placeholder="URL da imagem"
                                        style={styles.input}
                                        keyboardType="url"
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.button, styles.primaryButton]}
                                onPress={editingReview ? handleUpdate : handleCreate}
                            >
                                <Text style={styles.buttonText}>
                                    {editingReview ? 'Atualizar' : 'Adicionar'}
                                </Text>
                            </TouchableOpacity>

                            {editingReview && (
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={() => {
                                        clearFields();
                                        setEditingReview(null);
                                    }}
                                >
                                    <Text style={[styles.buttonText, { color: '#666' }]}>
                                        Cancelar
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <Text style={styles.listTitle}>Reviews Cadastradas ({reviews.length})</Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <View style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                            <View style={styles.customerInfo}>
                                <Text style={styles.customerName}>{item.customerName}</Text>
                                <Text style={styles.reviewDate}>{formatDate(item.reviewDate)}</Text>
                            </View>
                            <View style={styles.actions}>
                                <TouchableOpacity 
                                    onPress={() => handleLoad(item)} 
                                    style={[styles.actionButton, styles.editButton]}
                                >
                                    <Icon name="edit" size={16} color="#007AFF" />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => handleDelete(item.id)} 
                                    style={[styles.actionButton, styles.deleteButton]}
                                >
                                    <Icon name="trash-2" size={16} color="#FF3B30" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.ratingContainer}>
                            <View style={styles.starsContainer}>
                                {renderStars(item.grade)}
                            </View>
                            <Text style={styles.gradeText}>({item.grade}/5)</Text>
                        </View>

                        <Text style={styles.comment}>{item.comment}</Text>

                        {item.image && (
                            <View style={styles.imageContainer}>
                                <Image 
                                    source={{ uri: item.image }} 
                                    style={styles.productImage}
                                    resizeMode="cover"
                                />
                            </View>
                        )}
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhuma review encontrada</Text>
                        <Text style={styles.emptySubtext}>Adicione sua primeira review!</Text>
                    </View>
                }
                contentContainerStyle={styles.scrollContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 16,
        paddingTop: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: 20,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    form: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfWidth: {
        width: '48%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#34495e',
        marginBottom: 6,
        marginTop: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
        fontSize: 14,
    },
    textArea: {
        height: 70,
        textAlignVertical: 'top',
    },
    dateInput: {
        backgroundColor: '#f8f9fa',
        color: '#666',
    },
    charCount: {
        fontSize: 11,
        color: '#666',
        textAlign: 'right',
        marginTop: 2,
    },
    button: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    primaryButton: {
        backgroundColor: '#007AFF',
    },
    cancelButton: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 12,
        marginTop: 8,
    },
    reviewCard: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    customerInfo: {
        flex: 1,
    },
    customerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    reviewDate: {
        fontSize: 12,
        color: '#7f8c8d',
        marginTop: 2,
    },
    actions: {
        flexDirection: 'row',
    },
    actionButton: {
        padding: 6,
        borderRadius: 6,
        marginLeft: 6,
    },
    editButton: {
        backgroundColor: '#e3f2fd',
    },
    deleteButton: {
        backgroundColor: '#ffebee',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    starsContainer: {
        flexDirection: 'row',
        marginRight: 6,
    },
    star: {
        fontSize: 16,
        marginRight: 1,
    },
    gradeText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '600',
    },
    comment: {
        fontSize: 14,
        color: '#2c3e50',
        lineHeight: 20,
        marginBottom: 10,
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 8,
    },
    productImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 30,
    },
    emptyText: {
        fontSize: 16,
        color: '#7f8c8d',
        fontWeight: '600',
    },
    emptySubtext: {
        fontSize: 13,
        color: '#95a5a6',
        marginTop: 4,
    },
});