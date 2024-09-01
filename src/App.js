import React, { useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import Customer from "./Components/Customer";
import Product from "./Components/Product";
import StockEntry from "./Components/StockEntry";
import Invoice from "./Components/Invoice";
import Home from "./Components/Home";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    // <div>
    //   <Login />
    // </div>

    <Router>
      <div>
        <Header toggleSidebar={toggleSidebar} />
        <Sidebar
          activePage="Invoice"
          activeGroup="ui-elements"
          isCollapsed={isSidebarCollapsed}
        />

        <main
          className={`app-content ${isSidebarCollapsed ? "collapsed" : ""}`}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/product" element={<Product />} />
            <Route path="/stock" element={<StockEntry />} />
            <Route path="/invoice" element={<Invoice />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
