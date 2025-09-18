// src/layouts/Authlayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

function Authlayout() {
  return (
    <div>
      <h2>Auth Layout (Login/Register)</h2>
      {/* This is where Login or Register will render */}
      <Outlet />
    </div>
  );
}

export default Authlayout;
