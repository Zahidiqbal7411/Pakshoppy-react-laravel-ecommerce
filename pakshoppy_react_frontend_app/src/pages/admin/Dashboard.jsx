// src/pages/admin/Dashboard.jsx
import React from "react";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MainContent  from  "../../components/MainContent";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from "react-router-dom";


export default function Dashboard() {
  return (
    <div className="d-flex flex-column vh-100">
      {/* Navbar */}
     <Header />

      {/* Main Content Area */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div className="bg-light border-end" style={{ width: "220px" }}>
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 p-4 bg-white">
          <MainContent>
            <Outlet/>
          </MainContent>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
