// contexts/CartContext.tsx
import React, { createContext, useState, useContext } from "react";

/** Define a type for an item in the cart (adapt fields as needed). */
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

/** Define what our CartContext provides. */
interface CartContextValue {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Adds or increments quantity if item already in cart
  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      if (existingIndex >= 0) {
        // Increment quantity of existing item
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        // Add new item with quantity=1
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  // Decrements or removes item from cart
  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((i) => i.id === itemId);
      if (idx === -1) return prev;

      const updated = [...prev];
      if (updated[idx].quantity > 1) {
        updated[idx].quantity -= 1;
      } else {
        updated.splice(idx, 1);
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

/** Shortcut hook to use the cart context in any component. */
export const useCart = () => useContext(CartContext);
