import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { AuthProvider } from "./features/auth/AuthContext";
import { CartProvider } from "./features/cart/CartContext";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <CartProvider>
                    <AppRoutes />
                </CartProvider>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
