// src/layouts/Adminlayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

function Adminlayout() {
  return (
    <div>
      <h2>Admin Layout</h2>
      {/* This is where dashboard, user, etc., will render */}
      <Outlet />
    </div>
  );
}

export default Adminlayout;
