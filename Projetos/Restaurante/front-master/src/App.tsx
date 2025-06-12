// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Base/Navbar';
import { Produto } from './Page/Produto';
import { UserProducts } from './Components/Usuario/UserList';
import { Cart } from './Components/Usuario/Cart';
import Footer from './Components/Base/Footer';
import { CartProvider } from './Components/Usuario/Context';
import PedidoList from './Components/Admin/PedidoList';

import './Style.css';

const App: React.FC = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);

    return (
        <CartProvider>
            <BrowserRouter>
                <Navbar onNewProduct={() => setShowCreateModal(true)} />
                <Routes>
                    <Route
                        path="/"
                        element={<Produto isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />}
                    />
                    <Route path="/produtos" element={<UserProducts />} />
                    <Route path="/carrinho" element={<Cart />} />
                    <Route path="/pedidos" element={<PedidoList />} />
                </Routes>
                <Footer />
            </BrowserRouter>
        </CartProvider>
    );
};

export default App;