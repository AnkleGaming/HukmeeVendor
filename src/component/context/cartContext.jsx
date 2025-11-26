import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQty } : item
        )
      );
    }
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        calculateTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart
export const useCart = () => useContext(CartContext);
