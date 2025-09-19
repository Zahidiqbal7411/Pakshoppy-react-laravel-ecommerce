import React, { useEffect, useState } from "react";
import api from "../../api/axios"; // your axios instance

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
  const [productImages, setProductImages] = useState([]); // Files for upload
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      // Backend returns images as relations, map accordingly
      const data = res.data.map((p) => ({
        ...p,
        images: p.images ? p.images.map((img) => img.image_path) : [],
      }));
      setProducts(data);
    } catch (error) {
      console.error("Fetch products failed:", error);
    }
  };

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setProductImages(Array.from(e.target.files));
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();

    if (productImages.length === 0) {
      alert("Please select at least one image");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      // Append product fields
      formData.append("name", form.name);
      formData.append("slug", form.slug);
      formData.append("price", form.price);
      formData.append("description", form.description);
      if (form.discount_price) formData.append("discount_price", form.discount_price);
      formData.append("stock_keeping_unit", form.stock_keeping_unit);
      formData.append("quantity", form.quantity);
      formData.append("status", form.status);

      // Append images
      productImages.forEach((file) => {
        formData.append("product_images[]", file);
      });

      // Send multipart/form-data POST request
      const res = await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newProduct = res.data;
      newProduct.images = newProduct.images.map((img) => img.image_path);

      setProducts((prev) => [...prev, newProduct]);

      // Reset form and file input
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
      document.getElementById("productImageInput").value = "";
    } catch (err) {
      console.error("Failed to add product:", err);
      alert("Error adding product. See console.");
    } finally {
      setUploading(false);
    }
  };

  const deleteProduct = async (id) => {
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
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        marginRight: "5px",
                      }}
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
