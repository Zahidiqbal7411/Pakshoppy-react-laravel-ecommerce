import React from "react";

export default function MainContent({ children }) {
  return (
    <div className="container-fluid">
      {children}
    </div>
  );
}
