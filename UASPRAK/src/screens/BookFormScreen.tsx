import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, ScrollView, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, BookFormData, Book } from '../types';
import { createBook, updateBook, fetchBookDetail, fetchBooks, deleteBook } from '../services/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = StackScreenProps<RootStackParamList, 'BookForm'>;

const BookFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { bookId, initialBookData } = route.params || {};
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    genre: '',
    description: '',
    totalPages: 0,
  });
  const [books, setBooks] = useState<Book[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (bookId) {
      const loadBookData = async () => {
        const book = await fetchBookDetail(bookId);
        setFormData(book);
        setIsModalVisible(true);
      };
      loadBookData();
    } else if (initialBookData) {
      setFormData(initialBookData);
    }

    const loadBooks = async () => {
      const data = await fetchBooks();
      setBooks(data);
    };
    loadBooks();
  }, [bookId, initialBookData]);

  const handleChange = (name: keyof BookFormData, value: string | number) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (bookId) {
        await updateBook(bookId, formData);
        Alert.alert('Success', 'Book updated successfully');
      } else {
        await createBook(formData);
        Alert.alert('Success', 'Book created successfully');
      }
      setIsModalVisible(false);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'An error occurred while saving the book');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBook(id);
      Alert.alert('Success', 'Book deleted successfully');
      setBooks(books.filter(book => book._id !== id));
    } catch (error) {
      Alert.alert('Error', 'An error occurred while deleting the book');
    }
  };

  const openModal = () => {
    setFormData({
      title: '',
      author: '',
      genre: '',
      description: '',
      totalPages: 0,
    });
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>{bookId ? 'Edit Book' : 'Add Book'}</Text>
            <ScrollView contentContainerStyle={styles.modalForm}>
              <View style={styles.row}>
                <Text style={styles.label}>Title:</Text>
                <TextInput
                  value={formData.title}
                  onChangeText={(text) => handleChange('title', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Author:</Text>
                <TextInput
                  value={formData.author}
                  onChangeText={(text) => handleChange('author', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Genre:</Text>
                <TextInput
                  value={formData.genre}
                  onChangeText={(text) => handleChange('genre', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Description:</Text>
                <TextInput
                  value={formData.description}
                  onChangeText={(text) => handleChange('description', text)}
                  style={styles.input}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Total Pages:</Text>
                <TextInput
                  value={formData.totalPages.toString()}
                  onChangeText={(text) => handleChange('totalPages', parseInt(text))}
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButtonModal} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.header}>Books List</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Title</Text>
          <Text style={styles.tableHeaderText}>Author</Text>
          <Text style={styles.tableHeaderText}>Genre</Text>
          <Text style={styles.tableHeaderText}>Actions</Text>
        </View>
        {books.map((book) => (
          <View key={book._id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{book.title}</Text>
            <Text style={styles.tableCell}>{book.author}</Text>
            <Text style={styles.tableCell}>{book.genre}</Text>
            <View style={styles.tableCell}>
              <TouchableOpacity onPress={() => navigation.navigate('BookForm', { bookId: book._id })}>
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(book._id || '')}>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={openModal}>
        <Icon name="add" size={40} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#181818', // Latar belakang hitam
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e0e0e0', // Putih terang untuk judul
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Latar belakang transparan gelap
  },
  modalContainer: {
    width: '85%',
    padding: 20,
    backgroundColor: '#242424', // Abu-abu gelap
    borderRadius: 12,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e0e0e0',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalForm: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333', // Garis pemisah abu-abu gelap
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#b0b0b0', // Abu-abu terang untuk label
  },
  input: {
    flex: 2,
    padding: 8,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
    color: '#fff', // Putih untuk teks input
    backgroundColor: '#2b2b2b', // Abu-abu lebih gelap untuk input
  },
  saveButton: {
    backgroundColor: '#1e90ff', // Biru terang untuk tombol simpan
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButtonModal: {
    backgroundColor: '#e53935', // Merah terang untuk tombol tutup
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  table: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e90ff', // Biru terang untuk header tabel
    padding: 8,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // Putih untuk teks header tabel
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333', // Garis bawah untuk baris tabel
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#c0c0c0', // Abu-abu terang untuk teks sel
    textAlign: 'center',
  },
  actionText: {
    color: '#1e90ff', // Biru terang untuk aksi edit/delete
    textDecorationLine: 'underline',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1e90ff', // Biru terang untuk tombol tambah
    borderRadius: 50,
    padding: 16,
    elevation: 8,
  },
});


export default BookFormScreen;
