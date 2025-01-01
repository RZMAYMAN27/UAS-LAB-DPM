export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
}

export interface AuthResponse {
    data: {
        token: string;
    };
}

export interface ApiError {
    data: {
        message: string;
        errors?: {
            password?: string;
            username?: string;
        };
    };
}

export interface Book {
  _id?: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  totalPages: number;
}

export interface BookFormData {
  title: string;
  author: string;
  genre: string;
  description: string;
  totalPages: number;
}

export type RootStackParamList = {
    Splash: undefined;
    MainTabs: undefined;
    Register: undefined;
    Login: undefined;
    Profile: undefined;
    Home: undefined;
    BookList: undefined;
    BookDetail: { bookId: string };
    BookForm: { bookId?: string; initialBookData?: Book };
};