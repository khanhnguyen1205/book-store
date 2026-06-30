import { Routes, Route, Navigate } from 'react-router-dom';
import BookList from '../features/book/BookList';
import BookDetail from '../features/book/BookDetail';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import Profile from '../features/auth/Profile';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import Cart from '../features/cart/Cart';
import Checkout from '../features/order/Checkout';
import OrderConfirmation from '../features/order/OrderConfirmation';
import OrderHistory from '../features/order/OrderHistory';
import AdminLayout from '../features/admin/AdminLayout';
import Dashboard from '../features/admin/Dashboard';
import ManageBooks from '../features/admin/ManageBooks';
import ManageUsers from '../features/admin/ManageUsers';
import About from '../features/info/About';
import Contact from '../features/info/Contact';
import Privacy from '../features/info/Privacy';
import Terms from '../features/info/Terms';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<BookList />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
            <Route path="/order/:id" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="books" element={<ManageBooks />} />
                <Route path="users" element={<ManageUsers />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
