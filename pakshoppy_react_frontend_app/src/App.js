// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import Login from "./pages/admin/login";
// import Register from "./pages/admin/register";
// import Home from "./pages/user/home"; 
// import 'bootstrap/dist/css/bootstrap.min.css';

// function App() {
//   return (
//     <Router>
//       <nav className="navbar navbar-expand navbar-light bg-light">
//         <div className="container">
//           <Link className="navbar-brand" to="/">Pakshoppy</Link>
//           <div>
//             <ul className="navbar-nav">
//               <li className="nav-item">
//                 <Link className="nav-link" to="/login">Login</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link" to="/register">Register</Link>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>

//       <div className="container mt-3">
//         <Routes>
//            <Route path="/home" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import AppRoutes from './routes/Approutes';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
