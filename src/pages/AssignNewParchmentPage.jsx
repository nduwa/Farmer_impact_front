import React, { useState,useEffect } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import WelcomeBanner from "../partials/dashboard/WelcomeBanner";
import AssignNewParchmentTable from "../partials/dashboard/AssignNewParchmentTable";
import { fetchAllDryings } from "../redux/actions/dryings/allDryings.action";
import {fetchAllTransactions} from '../redux/actions/transactions/allTransactions.action'
import {useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function AssignNewParchment() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  const [allDryings, setAllDryings] = useState([])
  const [searchQuery, setSearchQuery] = useState();
  const { transactions, loading } = useSelector(
    (state) => state.fetchAllTransactions
  );

  const {dryings} = useSelector((state)=>state.fetchAllDrying)

  const token = localStorage.getItem("token")

  useEffect(() => {
    dispatch(fetchAllTransactions(token));
  }, [dispatch]);

  useEffect(() => {
    if (transactions) {
      setAllTransactions(transactions.data);
    }
  }, [transactions]);

  useEffect(() => {
    dispatch(fetchAllDryings());
  }, [dispatch]);

  useEffect(() => {
    if (dryings) {
      setAllDryings(dryings.data);
    }
  }, [dryings]);

  console.log("drdyings",dryings)

  const getUniqueValues = (arr, key) => {
    const uniqueValues = [];
    const uniqueKeys = new Set();

    arr.forEach((item) => {
      const value = item[key];

      if (!uniqueKeys.has(value)) {
        uniqueKeys.add(value);
        uniqueValues.push(item);
      }
    });

    return uniqueValues;
  };

  const filteredTransaction = searchQuery
    ? getUniqueValues(
        allTransactions?.filter((transaction) =>
          Object.values(transaction).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchQuery?.toLowerCase())
          )
        ),
        "transaction_date"
      )
    : getUniqueValues(allTransactions, "transaction_date")

    const calculateSumKilograms = (daylotnumber) => {
      const filteredTransactionsByDaylot = allTransactions.filter(
        (transaction) => transaction.cherry_lot_id === daylotnumber
      );
    
      if (filteredTransactionsByDaylot.length > 0) {
        return filteredTransactionsByDaylot.reduce(
          (sum, transaction) => sum + parseFloat(transaction.kilograms),
          0
        );
      } else {
        return 0; // or any default value you prefer when the array is empty
      }
    };
    const totalKilograms = (daylotnumber) => calculateSumKilograms(daylotnumber);

    const getGradeA = (cherry_lot_id) => {
      const gradeA = allDryings?.find((dry) => dry.day_lot_mumber === cherry_lot_id);
      return gradeA ? gradeA.GradeA : null;
    };
  
  

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
            {/* Welcome banner */}
            <WelcomeBanner />

            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              {/* Right: Actions */}
              
            </div>

            {/* <div className="grid grid-cols-12 gap-6"> */}
        <div className="py-4 ml-0 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
        <div className="items-center  justify-between block sm:flex md:divide-x md:divide-gray-100 dark:divide-gray-700">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="flex items-center sm:justify-end">
              
                <div className="ml-3">
                  <p>Record</p>
                  <select
                    name=""
                    value={30}
                    // onChange={handleItemsPerPageChange}
                    className="rounded-lg w-40"
                  >
                    <option value="20">20</option>
                    <option value="40">40</option>
                    <option value="60">60</option>
                  </select>
                </div>

              
            </div>
            <form className="sm:pr-3" action="#" method="GET">
              <label htmlFor="products-search" className="sr-only">
                Search
              </label>
              <div className="relative w-48 ml-3 mt-1 sm:w-64 mr-1 xl:w-96">
                <span>Search by CWS Name, Cherry Lot ID ...</span>
                <input
                  type="text"
                  name="email"
                //   onChange={handleSearch}
                  id="products-search"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Search for products"
                />
              </div>
            </form>
            <div className="flex pl-2 space-x-3 ">
              <div>
                <span>From</span>
                <input
                  type="date"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>
              <div>
                <span>To</span>
                <input
                  type="date"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div> 

      <div className="py-4 ml-0 bg-white dark:bg-slate-800 shadow-lg rounded-sm mt-2 border border-slate-200 dark:border-slate-700">
        <div className="items-center  justify-between block sm:flex md:divide-x md:divide-gray-100 dark:divide-gray-700">
          <div className="flex items-center mb-4 sm:mb-0">
          <div className="flex items-center sm:justify-end">
              <div className="flex pl-2 space-x-1 mt-1">
                <div className="flex justify-center items-center">
                 
                  <select
                    name=""
                    // value={itemsPerPage}
                    // onChange={handleItemsPerPageChange}
                    className="rounded-lg w-80"
                  >
                    <option value="" selected>Grade A</option>
                    <option value="">Grade B</option>
                    <option value="">Grade C</option>
                  </select>
                </div>

                <div>
                 
                  <select
                    name=""
                    // value={selectedStatus}
                    // onChange={handleStatusChange}
                    className="rounded-lg w-80"
                  >
                    <option value="">Certified</option>
                    <option value="" selected>Not Certified</option>
                    
                  </select>
                </div>
              </div>
            </div>
          
         
          </div>
        </div>
      </div> 
      <div className="flex flex-row left-4 items-center justify-center py-8 gap-3">
       
      </div>

              <AssignNewParchmentTable filteredTransactions={filteredTransaction} totalKilograms={totalKilograms} gradeA={getGradeA} />
            </div>
          {/* </div> */}
        </main>
      </div>
    </div>
  );
}
export default AssignNewParchment;