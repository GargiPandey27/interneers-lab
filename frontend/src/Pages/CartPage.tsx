import React from "react";
import { useCart } from "./ProductCart";
import ProductCard from "./Product";
import "../styles/CartPage.css";

const CartPage: React.FC = () => {
  const { cart } = useCart();

  return (
    <div className="cart-page">
      <h2>Your Shopping Cart</h2>
      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <div className="cart-products">
          {cart.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CartPage;
