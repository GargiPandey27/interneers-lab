import React, { useEffect, useState } from "react";
import ProductCard from "./Product";
import ProductDetail from "./ProductDetails";
import { Product } from "./Product.type";
import Navbar from "../Components/Navbar";
import "../styles/Product.css";
import { dummyProducts } from "./DummyData";

const PRODUCTS_PER_PAGE = 6;

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setProducts(dummyProducts);
    const uniqueCategories = Array.from(
      new Set(
        dummyProducts
          .map((p) => p.category)
          .filter((cat): cat is string => !!cat),
      ),
    );
    setCategories(uniqueCategories);
  }, []);

  const handleSearch = () => {
    if (!searchTerm) {
      setProducts(dummyProducts);
      return;
    }

    const filtered = dummyProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setProducts(filtered);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);

    if (!category) {
      setProducts(dummyProducts);
    } else {
      const filtered = dummyProducts.filter(
        (product) => product.category === category,
      );
      setProducts(filtered);
    }
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, endIndex);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  return (
    <>
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        selectedCategory={selectedCategory}
        categories={categories}
        handleCategoryChange={handleCategoryChange}
      />
      <main>
        <div className="products-container">
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              style={{ cursor: "pointer" }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="pagination-controls">
          <button onClick={handlePrevious} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={handleNext} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </main>
    </>
  );
};

export default ProductList;
