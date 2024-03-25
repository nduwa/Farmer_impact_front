import React, { useEffect, useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import WelcomeBanner from "../partials/dashboard/WelcomeBanner";


function AddUntraceableCoffee() {
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
        
            <WelcomeBanner />
          </div>
          <div className="flex items-center justify-center h-[60%] ">
          <div className="bg-white w-[45%] flex flex-col  border-2 rounded-md ">
           < div className="p-5 border-b-3 w-full">
            <p className=" text-green-500">Add Untraceable Coffee</p>
          

           </div>
           <div className="p-4">
            <form action="" className=" space-y-4">
              <label htmlFor="">Site collector</label> <br />
              <select name="" id="" className="w-full rounded-md">
                <option value="">Fifi Lavender</option>
                <option value="">Fifi Lavender</option>  
                <option value="">Fifi Lavender</option>
                <option value="">Fifi Lavender</option>
              </select>
              <input type="text" value="20/03/2024" className="w-full rounded-md"/>
              <input type="text"  className="w-full rounded-md"/>
              <input type="text"  className="w-full rounded-md"/>
              <input type="text"  className="w-full rounded-md"/>
              <div className=" flex justify-center">
              <button className=" bg-green-500 text-white rounded-md w-48 p-2">
                Save Coffee
              </button>

              </div>
              
            </form>
           </div>
              
            

          </div>
          </div>
         
        </main>
       
      </div>
    </div>
  );
}
export default AddUntraceableCoffee;
