import React from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
  selectedCategory: string;
  categories: string[];
  handleCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  selectedCategory,
  categories,
  handleCategoryChange,
}) => {
  return (
    <nav className="navbar">
      <div className="logo">Product Store</div>

      <div className="nav-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="category-filter">
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="cart-link-container">
          <Link to="/cart" className="cart-link">
            View Cart
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
