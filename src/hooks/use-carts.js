// hooks/useCart.ts (or .js if not using TypeScript)
import { useState, useEffect } from "react";

const CART_KEY = "cartItems";

const getInitialCart = () => {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
};

const useCart = () => {
  const [cartItems, setCartItems] = useState(getInitialCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_KEY);
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  return {
    cartItems,
    addToCart,
    clearCart,
    totalPrice,
  };
};

export default useCart;
