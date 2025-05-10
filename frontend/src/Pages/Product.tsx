import React from "react";
import { Product } from "./Product.type";
import "../styles/Product.css";
import { useCart } from "./ProductCart";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, removeFromCart, isInCart } = useCart();

  return (
    <div className="product-card">
      <div className="product-name">
        Name: <span>{product.name}</span>
      </div>
      <div className="product-description">
        Description: <span>{product.description || "No description"}</span>
      </div>
      <div className="product-price">
        Price: ₹ <span>{product.price_in_RS}</span>
      </div>
      <div className="product-item">
        Manufacture date: <span>{product.manufacture_date || "N/A"}</span>
      </div>
      <div className="product-item">
        Used by: <span>{product.expiry_date || "N/A"}</span>
      </div>
      <div className="product-item">
        Weight: <span>{product.weight_in_KG || "N/A"}</span>
      </div>
      <div className="product-item">
        Category: <span>{product.category || "N/A"}</span>
      </div>

      {/* Show "Add to Cart" if product isn't in cart, and "Remove from Cart" if it is */}
      {!isInCart(product.id) ? (
        <button
          className="add-to-cart-button"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
        >
          Add to Cart
        </button>
      ) : (
        <button
          className="remove-from-cart-button"
          onClick={(e) => {
            e.stopPropagation();
            removeFromCart(product.id);
          }}
        >
          Remove from Cart
        </button>
      )}
    </div>
  );
};

export default ProductCard;
