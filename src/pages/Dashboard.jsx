import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import FilterButton from "../components/DropdownFilter";
import DashboardCard01 from "../partials/dashboard/DashboardCard01";
import DashboardCard02 from "../partials/dashboard/DashboardCard02";
import DashboardCard03 from "../partials/dashboard/DashboardCard03";
import AvgPriceCard from "../partials/dashboard/AvgPriceCard";
import DashboardCard06 from "../partials/dashboard/DashboardCard06";
import ApprovedPriceCard from "../partials/dashboard/ApprovedPriceCard";
import FarmerPriceCard from "../partials/dashboard/FarmerPriceCard";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
           

            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              
                <FilterButton />
                
                <NavLink   
                    end
                    to="/user_supply_inventory_details">
                       <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                       <span className="hidden xs:block ml-2">See supply Inventory Detail</span>
                     </button>   

                </NavLink>
              
              
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
              {/* Line chart (Acme Plus) */}
              <DashboardCard01 />
              {/* Line chart (Acme Advanced) */}
              <DashboardCard02 />
              {/* Line chart (Acme Professional) */}
              <DashboardCard03 />
              <AvgPriceCard />
              <ApprovedPriceCard/>
              <FarmerPriceCard/>
             
              {/* Doughnut chart (Top Countries) */}
              {/* <DashboardCard06 /> */}
            
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
