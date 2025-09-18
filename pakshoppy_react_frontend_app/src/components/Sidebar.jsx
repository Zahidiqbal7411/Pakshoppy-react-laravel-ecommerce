import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="d-flex flex-column bg-light border-end vh-100 p-3" style={{ width: "250px" }}>
      <h4 className="mb-4 text-center">Pakshoppy</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink className="nav-link" to="/dashboard">
            📊 Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/dashboard/products">
            📦 Products
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/dashboard/orders">
            🛒 Orders
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/dashboard/customers">
            👤 Customers
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/dashboard/categories">
            🏷️ Categories
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/dashboard/reports">
            📑 Reports
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/dashboard/settings">
            ⚙️ Settings
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
