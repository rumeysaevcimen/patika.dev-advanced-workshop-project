import React, { useEffect, useState } from "react";
import { motoko_project_backend } from "../../declarations/motoko_project_backend";
import { FaPlus, FaEdit } from 'react-icons/fa';
import './index.scss';

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "" });
  const [stockStatus, setStockStatus] = useState({ id: "", inStock: true });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const allProducts = await motoko_project_backend.getAllProducts();
    setProducts(allProducts);
  };

  const addProduct = async () => {
    const { name, price, description } = newProduct;
    if (name && price && description) {
      const numericPrice = parseFloat(price); // Ensure price is a float
      await motoko_project_backend.addProduct(name, numericPrice, description);
      fetchProducts();
      setNewProduct({ name: "", price: "", description: "" }); // Reset form
    }
  };

  const updateStockStatus = async () => {
    const { id, inStock } = stockStatus;
    await motoko_project_backend.updateStockStatus(id, inStock);
    fetchProducts();
  };

  return (
    <div className="app-container">
      <h1>Products</h1>

      <div className="form-container">
        <h2>Add Product</h2>
        <div className="input-group">
          <input type="text" placeholder="Product Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
          <input
            type="text" 
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d*$/.test(value)) { // Allow decimal numbers
                setNewProduct({ ...newProduct, price: value });
              }
            }}
          />
          <input type="text" placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
        </div>
        <button className="button add-button" onClick={addProduct}>
          <FaPlus /> Add Product
        </button>
      </div>

      <div className="form-container">
        <h2>Update Stock Status</h2>
        <div className="input-group">
          <input type="number" placeholder="Product ID" onChange={(e) => setStockStatus({ ...stockStatus, id: parseInt(e.target.value) })} />
          <select onChange={(e) => setStockStatus({ ...stockStatus, inStock: e.target.value === "true" })}>
            <option value="true">In Stock</option>
            <option value="false">Out of Stock</option>
          </select>
        </div>
        <button className="button update-button" onClick={updateStockStatus}>
          <FaEdit /> Update Stock Status
        </button>
      </div>

      <h2>Product List</h2>
      <ul className="product-list">
        {products.map((product) => (
          <li key={product.id} className="product-item">
            <div className="product-details">
              <h3>{product.name}</h3>
              <p>Price: <span className="price">${parseFloat(product.price).toFixed(2) || 0}</span></p>
              <p>Description: {product.description}</p>
              <p className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                In Stock: {product.inStock ? "Yes" : "No"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
