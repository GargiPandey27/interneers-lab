import React from "react";
import { Product } from "./Product.type";
import "../styles/Product.css";
import { useCart } from "./ProductCart";
interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack }) => {
  const { addToCart, removeFromCart, isInCart } = useCart();

  return (
    <div className="product-detail">
      <button className="back-button" onClick={onBack}>
        ← Back to Products
      </button>
      <h2>{product.name}</h2>
      <p>
        <strong>Description:</strong> {product.description || "No description"}
      </p>
      <p>
        <strong>Price:</strong> ₹ {product.price_in_RS}
      </p>
      <p>
        <strong>Manufacture Date:</strong> {product.manufacture_date || "N/A"}
      </p>
      <p>
        <strong>Expiry Date:</strong> {product.expiry_date || "N/A"}
      </p>
      <p>
        <strong>Weight:</strong> {product.weight_in_KG} KG
      </p>
      <p>
        <strong>Category:</strong> {product.category}
      </p>

      {!isInCart(product.id) ? (
        <button
          className="add-to-cart-button"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
      ) : (
        <button
          className="remove-from-cart-button"
          onClick={() => removeFromCart(product.id)}
        >
          Remove from Cart
        </button>
      )}
    </div>
  );
};

export default ProductDetail;
