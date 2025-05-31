import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Image, Alert, Platform } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather';

const API_URL = 'https://682e52bd746f8ca4a47c99bc.mockapi.io/reviews';

export default function CrudReviews() {
    const [reviews, setReviews] = useState([]);
    const [grade, setGrade] = useState('');
    const [comment, setComment] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [reviewDate, setReviewDate] = useState('');
    const [image, setImage] = useState('');
    const [imageUri, setImageUri] = useState('');
    const [editingReview, setEditingReview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const setCurrentDate = () => {
        const now = new Date();
        const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
        setReviewDate(formattedDate);
    };

    const searchReviews = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(API_URL);
            setReviews(response.data);
        } catch (error) {
            console.error('Erro ao buscar reviews', error);
            showAlert('Erro', 'Lista de Reviews vazia ou erro na conexão');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        searchReviews();
        setCurrentDate();
    }, []);

    const showAlert = (title, message) => {
        if (Platform.OS === 'web') {
            alert(`${title}: ${message}`);
        } else {
            Alert.alert(title, message);
        }
    };

    const convertImageToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const selectImage = async () => {
        try {
            if (Platform.OS === 'web') {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = async (event) => {
                    const file = event.target.files[0];
                    if (file) {
                        try {
                            if (file.size > 5 * 1024 * 1024) {
                                showAlert('Erro', 'Imagem muito grande. Máximo 5MB.');
                                return;
                            }

                            const base64 = await convertImageToBase64(file);
                            setImage(base64);
                            setImageUri(base64);
                        } catch (error) {
                            showAlert('Erro', 'Erro ao processar imagem');
                        }
                    }
                };
                input.click();
            } else {
                try {
                    const { launchImageLibrary } = require('react-native-image-picker');

                    const options = {
                        mediaType: 'photo',
                        includeBase64: true,
                        maxHeight: 2000,
                        maxWidth: 2000,
                        quality: 0.8,
                    };

                    launchImageLibrary(options, (response) => {
                        if (response.didCancel) {
                            return;
                        }

                        if (response.errorMessage) {
                            showAlert('Erro', response.errorMessage);
                            return;
                        }

                        if (response.assets && response.assets[0]) {
                            const asset = response.assets[0];
                            const base64Image = `data:${asset.type};base64,${asset.base64}`;
                            setImage(base64Image);
                            setImageUri(asset.uri);
                        }
                    });
                } catch (error) {
                    showAlert('Aviso', 'Funcionalidade de seleção de imagem não disponível no mobile. Use a versão web ou instale react-native-image-picker.');
                }
            }
        } catch (error) {
            console.error('Erro ao selecionar imagem:', error);
            showAlert('Erro', 'Erro ao selecionar imagem');
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
            showAlert('Erro de Validação', 'Imagem é obrigatória');
            return false;
        }

        return true;
    };

    const handleGradeChange = (text) => {
        const numericText = text.replace(/[^0-5]/g, '');
        if (numericText.length <= 1) {
            setGrade(numericText);
        }
    };

    const handleCustomerNameChange = (text) => {
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

    const handleCreate = async () => {
        if (!validateInputs()) return;

        try {
            setIsLoading(true);
            const newReview = {
                grade: parseInt(grade),
                comment: comment.trim(),
                customerName: customerName.trim(),
                reviewDate,
                image: image.trim()
            };
            await axios.post(API_URL, newReview);
            await searchReviews();
            showAlert('Sucesso', 'Review inserida com sucesso!');
            clearFields();
        } catch (error) {
            console.error('Erro ao criar review', error);
            showAlert('Erro', 'Erro ao criar review');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoad = (review) => {
        setGrade(review.grade.toString());
        setComment(review.comment);
        setCustomerName(review.customerName);
        setReviewDate(review.reviewDate);
        setImage(review.image);
        setImageUri(review.image);
        setEditingReview(review);
    };

    const handleUpdate = async () => {
        if (!validateInputs()) return;

        try {
            setIsLoading(true);
            const updatedReview = {
                grade: parseInt(grade),
                comment: comment.trim(),
                customerName: customerName.trim(),
                reviewDate,
                image: image.trim()
            };
            await axios.put(`${API_URL}/${editingReview.id}`, updatedReview);
            await searchReviews();
            showAlert('Sucesso', 'Review atualizada com sucesso!');
            clearFields();
            setEditingReview(null);
        } catch (error) {
            console.error('Erro ao atualizar review', error);
            showAlert('Erro', 'Erro ao atualizar review');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (reviewId) => {
        const confirmDelete = async () => {
            try {
                setIsLoading(true);
                await axios.delete(`${API_URL}/${reviewId}`);
                await searchReviews();
                showAlert('Sucesso', 'Review deletada com sucesso!');
            } catch (error) {
                console.error('Erro ao deletar review', error);
                showAlert('Erro', 'Erro ao deletar review');
            } finally {
                setIsLoading(false);
            }
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
        setImageUri('');
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
            {/* Formulário */}
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
                        <Text style={styles.label}>Imagem *</Text>
                        <TouchableOpacity
                            style={styles.imageButton}
                            onPress={selectImage}
                        >
                            <Icon name="image" size={16} color="#007AFF" style={{ marginRight: 8 }} />
                            <Text style={styles.imageButtonText}>
                                {imageUri ? 'Alterar Imagem' : 'Selecionar Imagem'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {imageUri ? (
                    <View style={styles.imagePreviewContainer}>
                        <Text style={styles.label}>Preview da Imagem:</Text>
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.imagePreview}
                            resizeMode="contain"
                            onError={() => {
                                showAlert('Erro', 'Erro ao carregar imagem');
                                setImageUri('');
                                setImage('');
                            }}
                        />
                    </View>
                ) : null}

                <TouchableOpacity
                    style={[styles.button, styles.primaryButton, isLoading && styles.disabledButton]}
                    onPress={editingReview ? handleUpdate : handleCreate}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Processando...' : (editingReview ? 'Atualizar' : 'Adicionar')}
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

            {/* Lista de Reviews */}
            <FlatList
                data={reviews}
                keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                showsVerticalScrollIndicator={false}
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
                                    resizeMode="contain"
                                    onError={() => console.log('Erro ao carregar imagem da review')}
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
    imageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#007AFF',
        borderStyle: 'dashed',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f8f9ff',
    },
    imageButtonText: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '500',
    },
    imagePreviewContainer: {
        marginTop: 12,
        alignItems: 'center',
    },
    imagePreview: {
        width: 120,
        height: 120,
        borderRadius: 8,
        marginTop: 8,
        backgroundColor: '#f0f0f0',
    },
    button: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    primaryButton: {
        backgroundColor: '#000000',
    },
    cancelButton: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop: 8,
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
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
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 8,
    },
    productImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        backgroundColor: '#fff',
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