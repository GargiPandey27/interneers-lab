const productsContainer = document.getElementById("productsContainer");
const categoryFilter = document.getElementById("categoryFilter");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const productTemplate = document.getElementById("productTemplate");
const errorTemplate = document.getElementById("errorTemplate");

const BASE_URL = "http://localhost:8000/products/";
const CATEGORY_URL = "http://localhost:8000/products/categories/";

async function fetchProducts(category = "") {
  try {
    let url = BASE_URL;
    if (category) url += `?category=${category}`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.error) {
      renderError(data.error);
    } else {
      renderProducts(data);
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    renderError("Failed to fetch products. Please try again later.");
  }
}

function renderProducts(products) {
  productsContainer.innerHTML = "";

  // Once all product elements are prepared, it appends them to the DOM in a single batch
  const fragment = document.createDocumentFragment();
  
  products.forEach(product => {
    // Clones the template
    const productElement = productTemplate.content.cloneNode(true);
    
    // Fills in the data
    productElement.querySelector('[data-field="name"]').textContent = product.name;
    productElement.querySelector('[data-field="description"]').textContent = product.description || 'No description';
    productElement.querySelector('[data-field="price"]').textContent = product.price_in_RS || 'N/A';
    productElement.querySelector('[data-field="manufacture_date"]').textContent = product.manufacture_date || 'N/A';
    productElement.querySelector('[data-field="expiry_date"]').textContent = product.expiry_date || 'N/A';
    productElement.querySelector('[data-field="weight"]').textContent = product.weight_in_KG || 'N/A';
    productElement.querySelector('[data-field="category"]').textContent = product.category || 'N/A';
    
    // Adds to fragment
    fragment.appendChild(productElement);
  });
  productsContainer.appendChild(fragment);
}

function renderError(message) {
  const errorElement = errorTemplate.content.cloneNode(true);
  errorElement.querySelector('.error-message').textContent = message;
  productsContainer.innerHTML = '';
  productsContainer.appendChild(errorElement);
}

function searchProducts() {
  const keyword = searchInput.value.toLowerCase();
  
  if (!keyword) {
    fetchProducts(categoryFilter.value);
    return;
  }
  
  fetch(BASE_URL)
    .then(res => res.json())
    .then(data => {
      const filtered = data.filter(p => 
        p.name.toLowerCase().includes(keyword) || 
        (p.description && p.description.toLowerCase().includes(keyword))
      );
      renderProducts(filtered);
    })
    .catch(err => {
      console.error("Error searching products:", err);
      renderError("Failed to search products. Please try again later.");
    });
}

function filterByCategory() {
  const selected = categoryFilter.value;
  fetchProducts(selected);
}

async function loadCategories() {
  try {
    const res = await fetch(CATEGORY_URL);
    const categories = await res.json();
    
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.category_name;
      option.textContent = cat.category_name;
      categoryFilter.appendChild(option);
    });
  } catch (err) {
    console.error("Error fetching categories:", err);
  }
}

function initEventListeners() {
  categoryFilter.addEventListener("change", filterByCategory);
  searchButton.addEventListener("click", searchProducts);
  searchInput.addEventListener("input", function(event) {
    if (event.key === "Enter") {
      searchProducts();
    }
  });
}

window.onload = () => {
  loadCategories();
  fetchProducts();
  initEventListeners();
};