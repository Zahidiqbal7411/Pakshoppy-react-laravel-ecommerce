import React, { useEffect, useState } from "react";
import api from "../../api/axios"; // Adjust this import to your axios instance path

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    discount_price: "",
    stock_keeping_unit: "",
    quantity: "",
    price: "",
    description: "",
    status: "",
  });
  const [productImages, setProductImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // 👈 Added for image preview

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch all products with images
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      const data = res.data.map((p) => ({
        ...p,
        images: p.images ? p.images.map((img) => img.image_path) : [],
      }));
      setProducts(data);
    } catch (error) {
      console.error("Fetch products failed:", error);
    }
  };

  // Handle form field and file inputs
  const handleChange = (e) => {
    if (e.target.type === "file") {
      setProductImages(Array.from(e.target.files));
    } else {
      setForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  // Submit product + images in one request using FormData
  const addProduct = async (e) => {
    e.preventDefault();

    if (productImages.length === 0) {
      alert("Please select at least one image");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      productImages.forEach((file) => {
        formData.append("product_images[]", file);
      });

      const res = await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newProduct = res.data;
      newProduct.images = newProduct.images.map((img) => img.image_path);

      setProducts((prev) => [...prev, newProduct]);

      setForm({
        name: "",
        slug: "",
        discount_price: "",
        stock_keeping_unit: "",
        quantity: "",
        price: "",
        description: "",
        status: "",
      });
      setProductImages([]);
      document.getElementById("productImageInput").value = null;
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      if (err.response?.status === 422) {
        alert("Validation errors: " + JSON.stringify(err.response.data.errors));
      } else {
        alert("Something went wrong. Check console.");
      }
    } finally {
      setUploading(false);
    }
  };

  // Delete product handler
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Products</h2>

      <form onSubmit={addProduct} className="mb-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="form-control mb-2"
          required
        />
        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          placeholder="Slug"
          className="form-control mb-2"
          required
        />
        <input
          name="discount_price"
          type="number"
          value={form.discount_price}
          onChange={handleChange}
          placeholder="Discount Price"
          className="form-control mb-2"
        />
        <input
          name="stock_keeping_unit"
          value={form.stock_keeping_unit}
          onChange={handleChange}
          placeholder="SKU"
          className="form-control mb-2"
          required
        />
        <input
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          className="form-control mb-2"
          required
        />
        <input
          name="price"
          type="number"
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
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="form-control mb-2"
          required
        >
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <input
          type="file"
          name="product_images"
          id="productImageInput"
          onChange={handleChange}
          className="form-control mb-2"
          multiple
          required
          disabled={uploading}
          accept="image/*"
        />
        <button type="submit" className="btn btn-success" disabled={uploading}>
          {uploading ? "Uploading..." : "Add Product"}
        </button>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Discount Price</th>
            <th>SKU</th>
            <th>Quantity</th>
            <th>Slug</th>
            <th>Images</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.description}</td>
              <td>{p.discount_price}</td>
              <td>{p.stock_keeping_unit}</td>
              <td>{p.quantity}</td>
              <td>{p.slug}</td>
              <td>
                {p.images && p.images.length > 0 ? (
                  p.images.map((img, i) => (
                    <img
                      key={i}
                      src={`http://localhost:8000/${img}`}
                      alt={`${p.name}-${i}`}
                      onClick={() => setPreviewImage(`http://localhost:8000/${img}`)} // 👈 Click to preview
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        marginRight: "5px",
                        cursor: "pointer",
                      }}
                      title="Click to preview"
                    />
                  ))
                ) : (
                  <span>No Images</span>
                )}
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteProduct(p.id)}
                  disabled={uploading}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Image Preview Overlay */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            cursor: "pointer",
          }}
        >
          <img
            src={previewImage}
            alt="Preview"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              border: "4px solid white",
              borderRadius: "10px",
              boxShadow: "0 0 20px rgba(255,255,255,0.5)",
            }}
          />
        </div>
      )}
    </div>
  );
}
