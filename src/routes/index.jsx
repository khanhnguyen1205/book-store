import { Routes, Route, Navigate } from 'react-router-dom';
import BookList from '../features/book/BookList';
import BookDetail from '../features/book/BookDetail';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<BookList />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;