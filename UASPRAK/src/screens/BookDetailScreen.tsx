import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { fetchBookDetail, deleteBook } from '../services/api';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, Book } from '../types';
import { Card, Title, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ikon untuk tombol aksi

type Props = StackScreenProps<RootStackParamList, 'BookDetail'>;

const BookDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { bookId } = route.params;
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    const loadBookDetail = async () => {
      const data = await fetchBookDetail(bookId);
      setBook(data);
    };
    loadBookDetail();
  }, [bookId]);

  const handleDelete = async () => {
    try {
      await deleteBook(bookId);
      Alert.alert('Success', 'Book deleted successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'An error occurred while deleting the book');
    }
  };

  if (!book) {
    return <Paragraph style={styles.loadingText}>Loading...</Paragraph>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Tombol kembali */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Detail Buku */}
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Title style={styles.title}>{book.title}</Title>
          <Paragraph style={styles.paragraph}><strong>Author:</strong> {book.author}</Paragraph>
          <Paragraph style={styles.paragraph}><strong>Genre:</strong> {book.genre}</Paragraph>
          <Paragraph style={styles.paragraph}><strong>Description:</strong> {book.description}</Paragraph>
          <Paragraph style={styles.paragraph}><strong>Total Pages:</strong> {book.totalPages}</Paragraph>
        </Card.Content>
      </Card>

      {/* Tombol aksi (misalnya tombol tambah ke favorit) */}
      <TouchableOpacity style={styles.favoriteButton}>
        <Icon name="favorite-border" size={28} color="#fff" />
        <Paragraph style={styles.favoriteText}>Add to Favorites</Paragraph>
      </TouchableOpacity>

      {/* Buttons for editing and deleting the book */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('BookForm', { bookId })}
        >
          <Icon name="edit" size={28} color="#fff" />
          <Paragraph style={styles.buttonText}>Edit</Paragraph>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Icon name="delete" size={28} color="#fff" />
          <Paragraph style={styles.buttonText}>Delete</Paragraph>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212', // Dark background for modern aesthetic
  },
  loadingText: {
    fontSize: 18,
    color: '#e0e0e0', // Light gray for the loading text
    textAlign: 'center',
    marginTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 16,
    backgroundColor: '#9c27b0', // Deep purple back button
    padding: 12,
    borderRadius: 50,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  card: {
    marginTop: 120,
    borderRadius: 20,
    backgroundColor: '#333', // Dark card background
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e0e0e0',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
    color: '#e0e0e0',
  },
  favoriteButton: {
    marginTop: 40,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#f50057', // Vibrant pink for favorite button
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  favoriteText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  editButton: {
    backgroundColor: '#6200ea', // Vibrant purple for edit button
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#e53935', // Bright red for delete button
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
});

export default BookDetailScreen;
