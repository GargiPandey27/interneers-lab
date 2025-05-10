import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "./Product.type";
import { toast } from "react-toastify";

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  isInCart: (id: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    if (!cart.find((item) => item.id === product.id)) {
      setCart((prevCart) => [...prevCart, product]);
      toast.success("Added to cart!", { position: "bottom-right" });
    }
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    toast.info("Removed from cart", { position: "bottom-right" });
  };

  const isInCart = (id: number) => {
    return cart.some((product) => product.id === id);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
