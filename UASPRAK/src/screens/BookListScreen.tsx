import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, TextInput, StyleSheet, Image, Dimensions } from 'react-native';
import { fetchBooks } from '../services/api';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, Book } from '../types';
import { Card, Title, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = StackScreenProps<RootStackParamList, 'BookList'>;

const BookListScreen: React.FC<Props> = ({ navigation }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [genreQuery, setGenreQuery] = useState('');
  const [authorQuery, setAuthorQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadBooks = async () => {
      const data = await fetchBooks();
      setBooks(data);
    };
    loadBooks();
  }, []);

  const handleSearch = async () => {
    const data = await fetchBooks({ genre: genreQuery, author: authorQuery });
    setBooks(data);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (genreQuery ? book.genre.toLowerCase().includes(genreQuery.toLowerCase()) : true) &&
    (authorQuery ? book.author.toLowerCase().includes(authorQuery.toLowerCase()) : true)
  );

  return (
    <View style={styles.container}>
      {/* Search/Filter Icon */}
      <TouchableOpacity onPress={() => setShowForm(!showForm)} style={styles.iconButton}>
        <Icon name="filter-list" size={30} color="#ffffff" />
      </TouchableOpacity>

      {showForm && (
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Search by title"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            style={styles.input}
          />
          <TextInput
            placeholder="Filter by genre"
            value={genreQuery}
            onChangeText={setGenreQuery}
            onSubmitEditing={handleSearch}
            style={styles.input}
          />
          <TextInput
            placeholder="Filter by author"
            value={authorQuery}
            onChangeText={setAuthorQuery}
            onSubmitEditing={handleSearch}
            style={styles.input}
          />
        </View>
      )}

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item._id || ''}
        numColumns={3} // Layout with 3 columns
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('BookDetail', { bookId: item._id || '' })}>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                {/* Book Image */}
                
                <Title style={styles.title}>{item.title}</Title>
                <Paragraph style={styles.paragraph}>{item.author}</Paragraph>
                <Paragraph style={styles.paragraph}>{item.genre}</Paragraph>
                <Paragraph style={styles.description} numberOfLines={2}>{item.description}</Paragraph>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const { width } = Dimensions.get('window'); // To handle dynamic width

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212', // Dark mode background
  },
  iconButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#6200ea',
    padding: 12,
    borderRadius: 50,
    elevation: 8,
    zIndex: 10,
  },
  formContainer: {
    marginBottom: 16,
    backgroundColor: '#242424',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  input: {
    marginBottom: 16,
    padding: 12,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
    color: '#fff',
    backgroundColor: '#333',
  },
  card: {
    marginBottom: 20,
    marginHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#242424',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    flex: 1,
    height: 350,
    maxWidth: (width - 48) / 3,
    width: (width - 48) / 3,
    transform: [{ scale: 1 }],
  },
  cardContent: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  bookImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: '#c0c0c0',
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    color: '#777',
    marginTop: 8,
  },
});

export default BookListScreen;
