import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", description: "" });

  // Fetch products on mount
  useEffect(() => {
    api.get("/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err.response || err));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add product
  const addProduct = (e) => {
    e.preventDefault();
    api.post("/products", form)
      .then(res => {
        setProducts([...products, res.data]);
        setForm({ name: "", price: "", description: "" });
      })
      .catch(err => console.error(err.response || err));
  };

  // Delete product
  const deleteProduct = (id) => {
    api.delete(`/products/${id}`)
      .then(() => setProducts(products.filter(p => p.id !== id)))
      .catch(err => console.error(err.response || err));
  };

  return (
    <div className="container mt-4">
      <h2>Manage Products</h2>

      {/* Add product form */}
      <form onSubmit={addProduct} className="mb-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="form-control mb-2"
          required
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="form-control mb-2"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="form-control mb-2"
          required
        />
        <button type="submit" className="btn btn-success">Add Product</button>
      </form>

      {/* Product list */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Price</th><th>Description</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>${p.price}</td>
              <td>{p.description}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteProduct(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
