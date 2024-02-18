import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { Routes, Route, useLocation } from "react-router-dom";

import "./css/style.css";

import "./charts/ChartjsConfig";

// Import pages
import Dashboard from './pages/Dashboard';
import UserSupplyInventoryDetails from './pages/UserSupplyInventoryDetails';
import UserTransactions from './pages/UserTransactions';
import CwsDailyJournal from './pages/CwsDailyJournal';
import LoginPage from './pages/LoginPage';
import Users from './pages/Users';



function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route exact path="/dashboard" element={<Dashboard />} />
    
        <Route exact path="/user_supply_inventory_details" element={<UserSupplyInventoryDetails />} />
        <Route exact path="/user_transactions" element={<UserTransactions />} />
        <Route exact path="/user_transaction/cws-daily-journals" element={<CwsDailyJournal />} />
        <Route exact path="/users" element={<Users />} />
        <Route exact path="/" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
