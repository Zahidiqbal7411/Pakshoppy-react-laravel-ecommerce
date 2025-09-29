// import { Routes, Route, Navigate } from "react-router-dom";
// import Login from "../pages/user/login";
// import Register from "../pages/register"; // make sure this exists

// import Dashboard from "../pages/admin/Dashboard";
// import Setting from "../pages/admin/Settings";
// import User from "../pages/admin/User";
// import Authlayout from "../layouts/Authlayout";
// import Adminlayout from "../layouts/Adminlayout";
// import PrivateRoute from "./PrivateRoutes";

// function Approutes() {
//   return (
//     <Routes>
//       {/* Public Auth Layout */}
//       <Route element={<Authlayout />}>
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//       </Route>

//       {/* Private/Admin Routes */}
//       <Route element={<PrivateRoute><Adminlayout /></PrivateRoute>}>
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/user" element={<User />} />
//         <Route path="/setting" element={<Setting />} />
//       </Route>

//       {/* Default route */}
//       <Route path="*" element={<Navigate to="/login" />} />
//     </Routes>
//   );
// }

// export default Approutes;
// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Login from "../pages/user/login";
// import Authlayout from "../layouts/Authlayout";

// export default function Approutes() {
//   return (
//     <Routes>
//       <Route element={<Authlayout />}>
//         <Route path="/login" element={<Login />} />
//       </Route>
//       <Route path="*" element={<Navigate to="/login" />} />
//     </Routes>
//   );
// }
// src/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Login from "../pages/user/login";
import Register from "../pages/user/register";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import Orders from "../pages/admin/Orders";
import Reports from "../pages/admin/Reports";
import Category from "../pages/admin/Category";
import Settings from "../pages/admin/Settings";
import Customer from "../pages/admin/Customer";
 

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />  {/* Default login page */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard with nested routes */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<h1>Welcome to Admin Dashboard</h1>} />
        <Route path="products" element={<Products  />} />
        <Route path="orders" element={<Orders />} />
        <Route path="reports" element={<Reports />} />
        <Route path="categories" element={<Category />}/>
        <Route path="settings" element={<Settings />}/>
        <Route path="customers" element={<Customer />}/>
      </Route>

      {/* Catch all (404) */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}
