import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // Send login request
      const res = await api.post("/login", data);

      if (res.data.access_token) {
        // Store the access token in localStorage
        localStorage.setItem("token", res.data.access_token);

        // Set default Authorization header for future requests
        api.defaults.headers.common["Authorization"] = `Bearer ${res.data.access_token}`;
      }

      // Redirect to admin dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      alert(err.response?.data?.message || "Invalid credentials or server error");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4 rounded">
            <h2 className="text-center mb-4">Admin Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  {...register("password", { required: true })}
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  required
                />
              </div>

              <button type="submit" className="btn btn-success w-100">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
