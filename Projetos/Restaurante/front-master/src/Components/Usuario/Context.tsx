// src/Components/Cart/Context.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Produto } from '../../Type.ts';

interface CartContextData {
    cartItems: Produto[];
    cartTotal: number;
    addToCart: (item: Produto) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextData | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Inicializa do localStorage ou com array vazio
    const [cartItems, setCartItems] = useState<Produto[]>(() => {
        try {
            const stored = localStorage.getItem('cart');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    // Recalcula total
    const cartTotal = cartItems.reduce((sum, item) => sum + item.preco, 0);

    // Sempre que cartItems mudar, grava no localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item: Produto) => {
        setCartItems(prev => [...prev, item]);
    };

    const removeFromCart = (id: number) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, cartTotal, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export function useCart(): CartContextData {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
}
