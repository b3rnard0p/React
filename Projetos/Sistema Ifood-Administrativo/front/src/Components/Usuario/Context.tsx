// src/Components/Cart/Context.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import type { CartContextData, CartItem } from "../../Type.ts";

const CartContext = createContext<CartContextData | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Inicializa do localStorage ou com array vazio
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Recalcula total
  const cartTotal = cartItems.reduce((sum, item) => sum + item.preco, 0);

  // Sempre que cartItems mudar, grava no localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
  };

  const removeFromCart = (id: number | string) => {
    setCartItems((prevItems) => {
      const index = prevItems.findIndex((item) => {
        // Para custom burgers, comparar com customBurgerId se disponível
        if ("customBurgerId" in item && item.customBurgerId === id) {
          return true;
        }
        // Para outros itens, comparar com id
        return item.id === id;
      });
      if (index === -1) return prevItems; // Não encontrado
      const newItems = [...prevItems];
      newItems.splice(index, 1); // Remove só uma unidade
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, cartTotal, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextData {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
