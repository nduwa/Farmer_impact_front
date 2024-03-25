import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { Routes, Route, useLocation } from "react-router-dom";
import AccessControlMobile from "./pages/AccessControlMobile";
import { useParams } from "react-router-dom";
import "./css/style.css";

import "./charts/ChartjsConfig";

// Import pages
import Dashboard from "./pages/Dashboard";
import UserSupplyInventoryDetails from "./pages/UserSupplyInventoryDetails";
import UserTransactions from "./pages/UserTransactions";
import CwsDailyJournal from "./pages/CwsDailyJournal";
import LoginPage from "./pages/LoginPage";
import Users from "./pages/Users";
import AccessControl from "./pages/AccessControl";
import TransactionDetails from "./pages/TransactionDetails";
import AddUntraceableCoffee from "./pages/AddUntraceableCoffee";
import AssignedParchment from "./pages/AssignedParchment";
import GeneralHarvestPage from "./pages/GeneralHarvestPage";
import SiteHarvestPage from "./pages/SiteHarvestPage";
import CherryLotDetails from "./pages/CherryLotDetails";
import SiteDayLotDetails from "./pages/SiteDayLotDetails";
import LotsInAdayLot from "./pages/LotsInAdayLot";
import AssignNewParchment from "./pages/AssignNewParchmentPage";

function App() {
  const location = useLocation();
  const userId = useParams();
  const journalId = useParams();
  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route exact path="/dashboard" element={<Dashboard />} />

        <Route
          exact
          path="/user_supply_inventory_details"
          element={<UserSupplyInventoryDetails />}
        />
        <Route exact path="/user_transactions" element={<UserTransactions />} />
        <Route
          exact
          path="/user-transactions/cws-daily-journals"
          element={<CwsDailyJournal />}
        />
        <Route exact path="/user-administration" element={<Users />} />
        <Route exact path="/" element={<LoginPage />} />
        <Route
          exact
          path="/user-administaration/access-controll/module-access/:userId"
          element={<AccessControl />}
        />
        <Route
          exact
          path="/user-administaration/access-controll/mobile-access/:userId"
          element={<AccessControlMobile />}
        />
        <Route
          exact
          path="/user_transactions/staff_lot_details/:journalId"
          element={<TransactionDetails />}
        />
        <Route
          exact
          path="/user-transactions/cherry_lot_details/:cherryLotId"
          element={<CherryLotDetails />}
        /> <Route
        exact
        path="/user-transactions/site_day_lot_details/:journalId"
        element={<SiteDayLotDetails />}
      />
      <Route
        exact
        path="/user-transactions/lots_in_a_day_lot/:cherryLotId"
        element={<LotsInAdayLot />}
      />
        <Route
          exact
          path="/user_transaction/add_untraceable_coffee"
          element={<AddUntraceableCoffee />}
        />
          <Route
          exact
          path="/user_inventory_management/assigned_parchment"
          element={<AssignedParchment />}
        />
         <Route
          exact
          path="/user_registration/general_harvest"
          element={<GeneralHarvestPage />}
        />
         <Route
          exact
          path="/user_registration/site_harvest"
          element={<SiteHarvestPage />}
        />
        <Route
          exact
          path="/user_inventory_management/new_parchment_assignement"
          element={<AssignNewParchment />}
        />
         
      </Routes>
    </>
  );
}
export default App;
