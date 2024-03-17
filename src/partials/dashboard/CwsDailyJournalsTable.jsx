import React, { useState, useEffect } from "react";
import UpdateItemDrawer from "./UpdateItemDrawer";
import DeleteItemDrawer from "./DeleteItemDrawer";
import AddItemDrawer from "./AddItemDrawer";
import DashboardCard02 from "./DashboardCard02";
import DashboardCard03 from "./DashboardCard03";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchAllTransactions } from "../../redux/actions/transactions/allTransactions.action";
import { MdAdd } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { fetchAllStation } from "../../redux/actions/station/allStations.action";

const CwsDailyJournalsTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [allTransactions, setAllTransactions] = useState([]);
  const { transactions, loading } = useSelector(
    (state) => state.fetchAllTransactions
  );
  const [allStation, setAllStation] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState();
  const { stations } = useSelector((state) => state.fetchAllStations);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const token = localStorage.getItem("token");
  const [itemsPerPage, setItemsPerPage] = useState(20);

  useEffect(() => {
    dispatch(fetchAllTransactions(token));
  }, [dispatch]);

  useEffect(() => {
    if (transactions) {
      setAllTransactions(transactions.data);
    }
  }, [transactions]);
  console.log("transactions", allTransactions);

  useEffect(() => {
    dispatch(fetchAllStation());
  }, [dispatch]);

  useEffect(() => {
    if (stations) {
      setAllStation(stations.data);
    }
  }, [stations]);

  if (loading) {
    return <p className=" text-center">..Loading..</p>;
  }

  const handleSearch = (e) => {
    const searchItem = e.target.value;
    setSearchQuery(searchItem);
  };

  // Function to get unique values from an array
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
    : getUniqueValues(allTransactions, "transaction_date").filter(
        (transaction) =>
          selectedStatus === "all" ||
          (selectedStatus === "open" && transaction.approved !== 1) ||
          (selectedStatus === "closed" && transaction.approved === 1)
      );
  console.log("filtered", filteredTransaction);

  const getUserScIdById = (_kf_Staff) => {
    const staff = allStaff?.find((staff) => staff.__kp_Staff === _kf_Staff);
    return staff ? staff.userID : null;
  };

  const getStationName = (_kf_Station) => {
    const station = allStation?.find(
      (station) => station.__kp_Station === _kf_Station
    );
    return station ? station.Name : null;
  };

  const calculateTotalKilogramsByJournal = () => {
    const sumByJournal = {};

    // Iterate through transactions
    allTransactions.forEach((transaction) => {
      const journal = transaction.transaction_date;
      const kilograms = transaction.kilograms || 0;

      // Check if the JOURNAL# exists in the sumMap
      if (!sumByJournal[journal]) {
        sumByJournal[journal] = 0;
      }

      // Add kilograms to the sumMap
      sumByJournal[journal] += kilograms;
    });

    return sumByJournal;
  };

  // Call the calculateTotalKilogramsByJournal function to get the sum
  const sumByJournal = calculateTotalKilogramsByJournal();

  const calculateTotalPrice = () => {
    const totalPriceByJournal = {};

    allTransactions.forEach((transaction) => {
      const journal = transaction.site_day_lot;
      const cash = transaction.cash_paid || 0;

      if (!totalPriceByJournal[journal]) {
        totalPriceByJournal[journal] = 0;
      }

      totalPriceByJournal[journal] += cash;
    });

    return totalPriceByJournal;
  };

  const totalPriceByJournal = calculateTotalPrice();

  const sumFloatersKG = () => {
    const sum = {};

    allTransactions.forEach((transaction) => {
      const journal = transaction.site_day_lot;
      const kilograms = transaction.bad_kilograms;

      if (!sum[journal]) {
        sum[journal] = 0;
      }

      sum[journal] += kilograms;
    });

    return sum;
  };
  const floatersSum = sumFloatersKG();

  const calculateTotalKilogramsPurchased = (transaction) => {
    const certifiedKG =
      transaction.certified === 1
        ? sumByJournal[transaction.site_day_lot] || 0
        : 0;
    const uncertifiedKG =
      transaction.certified === 1
        ? 0
        : sumByJournal[transaction.site_day_lot] || 0;
    const floatersKG = floatersSum[transaction.site_day_lot] || 0;

    return certifiedKG + uncertifiedKG + floatersKG;
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
  };
  const totalPages = Math.ceil(filteredTransaction?.length / itemsPerPage);
  console.log("pages", totalPages);
  // Paginate the user data
  const paginatedTransactions = filteredTransaction?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const allPaperReceipts = allTransactions.map(
    (transaction) => transaction.paper_receipt
  );
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };
  const getJournalsByDate = (cherrylotud) => {
    // Filter transactions based on the provided date
    const journals = allTransactions.filter(
      (transaction) => transaction.cherry_lot_id === cherrylotud
    );
    return journals;
  };

  const journals = getJournalsByDate("23SR054CH0704C");
  console.log("by cherrrrryyyyy", journals);
  const isUniquePaperSlip = (paperReceipt) => {
    const occurrences = allPaperReceipts.filter(
      (value) => value === paperReceipt
    ).length;

    return occurrences === 1;
  };

  const calculateTotalValues = () => {
    const totalValues = {
      uploadedTime: 0,
      transactionDate: "",
      totalFloaters: 0,
      averagePrice: 0,
      totalCertified: 0,
      totalUncertified: 0,
      totalCoffeeValue: 0,
      totalUnTraceableKg: 0,
      totalKgs: 0,
      siteCollector: "",
    };

    allTransactions.forEach((transaction) => {
      totalValues.transactionDate = transaction.transaction_date;

      totalValues.uploadedTime = transaction.uploaded_at;

      if (transaction.certified === 1) {
        totalValues.totalCertified += transaction.kilograms;
        totalValues.totalUncertified = 0;
      } else {
        totalValues.totalUncertified += transaction.kilograms;
        totalValues.totalCertified = 0;
      }
      totalValues.totalFloaters += transaction.bad_kilograms;
      totalValues.averagePrice = transaction.unitprice;
      totalValues.totalCoffeeValue +=
        transaction.kilograms * transaction.unitprice +
        transaction.bad_kilograms * transaction.bad_unit_price;
      totalValues.totalKgs =
        totalValues.totalCertified +
        totalValues.totalUncertified +
        totalValues.totalFloaters;
    });

    return totalValues;
  };
  const totalValues = calculateTotalValues();

  return (
    <div className="flex flex-col col-span-full xl:col-span-12">
      <div className="py-4 ml-0 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
        <div className="items-center  justify-between block sm:flex md:divide-x md:divide-gray-100 dark:divide-gray-700">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="flex items-center sm:justify-end">
              <div className="flex pl-2 space-x-1 mt-1">
                {/* <p>Records</p> */}
                <div>
                  <span>Record</span>
                  <select
                    name=""
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="rounded-lg w-40"
                  >
                    <option value="20">20</option>
                    <option value="40">40</option>
                    <option value="60">60</option>
                  </select>
                </div>

                {/* <p>Status</p> */}
                <div>
                  <span>Status</span>
                  <select
                    name=""
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    className="rounded-lg w-40"
                  >
                    <option value="all">All</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
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
                  onChange={handleSearch}
                  id="products-search"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Search for products"
                />
              </div>
            </form>
            <div className="flex pl-2 space-x-1 -ml-3">
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
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-30  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row left-4 items-center justify-center py-8 gap-3">
        <DashboardCard02
          cardTitle="TOTAL CHERRY PURCHASES"
          totalCherryPurchases={totalValues.totalKgs.toLocaleString()}
          certified={totalValues.totalCertified.toLocaleString()}
          traceableUncertified={totalValues.totalCertified.toLocaleString()}
          uncertifiedUntraceable={totalValues.totalUncertified.toLocaleString()}
          floaters={totalValues.totalFloaters.toLocaleString()}
        />
        <DashboardCard02
          cardTitle="PROJECTED PARCHMENT (KG)"
          totalCherryPurchases={totalValues.totalKgs.toLocaleString()}
          certified={totalValues.totalCertified.toLocaleString()}
          traceableUncertified={totalValues.totalCertified.toLocaleString()}
          uncertifiedUntraceable={totalValues.totalUncertified.toLocaleString()}
          floaters={totalValues.totalFloaters.toLocaleString()}
        />
        <DashboardCard02
          cardTitle="PREVIOUS APPROVED PRICE"
          totalCherryPurchases={totalValues.totalKgs.toLocaleString()}
          certified={totalValues.totalCertified.toLocaleString()}
          traceableUncertified={totalValues.totalCertified.toLocaleString()}
          uncertifiedUntraceable={totalValues.totalUncertified.toLocaleString()}
          floaters={totalValues.totalFloaters.toLocaleString()}
        />
        <DashboardCard02
          cardTitle="CURRENT PURCHASE PRICE"
          totalCherryPurchases={totalValues.totalKgs.toLocaleString()}
          certified={totalValues.totalCertified.toLocaleString()}
          traceableUncertified={totalValues.totalCertified.toLocaleString()}
          uncertifiedUntraceable={totalValues.totalUncertified.toLocaleString()}
          floaters={totalValues.totalFloaters.toLocaleString()}
        />
      </div>
      <div className="flex flex-row left-4 items-center justify-center py-8 gap-3"></div>

      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th scope="col" colSpan={4} className="p-4"></th>
                    <th
                      scope="col"
                      colSpan={2}
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      CERTIFIED
                    </th>
                    <th
                      scope="col"
                      colSpan={2}
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      UNCERTIFIED
                    </th>
                    <th
                      scope="col"
                      colSpan={3}
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      BUCKET COUNT
                    </th>
                    <th
                      scope="col"
                      colSpan={3}
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Skin Drying Grade Weighing
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    ></th>
                  </tr>

                  <tr>
                    {/* <th scope="col"
                   
                     className="p-4">
                     
                    </th> */}
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      CWS.NAME
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      STATUS
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      PURCHASE.DATE
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      CHERRY.LOT.ID
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      KG
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      PX
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      KG
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      PX
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      GRADE.A
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      GRADE.B
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      GRADE.C
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      GRADE.A
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      GRADE.B
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      GRADE.C
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      FARMERS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {paginatedTransactions?.map((journal, index) => (
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td className="w-4 p-4">
                        {getStationName(journal._kf_Station)}
                      </td>
                      <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                        {journal.fm_approval === 0 ? (
                          <button className="bg-red-500 text-white w-24 h-8 rounded-md">
                            Open
                          </button>
                        ) : (
                          <button className="bg-green-500 text-white w-24 h-8 rounded-md">
                            Closed
                          </button>
                        )}
                      </td>
                      <td class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {journal.transaction_date}
                      </td>
                      <td class="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">
                        <a
                          href={`/user-transactions/cherry_lot_details/${journal.cherry_lot_id}`}
                          className="text-blue-500 hover:text-gray-500"
                        >
                          #{journal.site_day_lot}
                        </a>
                      </td>
                      <td class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {journal.certified === 1
                          ? sumByJournal[
                              journal.transaction_date
                            ]?.toLocaleString()
                          : ""}
                      </td>
                      <td class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {journal.certified === 1 ? journal.unitprice : ""}
                      </td>
                      <td class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {journal.certified === 1
                          ? ""
                          : sumByJournal[
                              journal.transaction_date?.toLocaleString()
                            ]}
                      </td>
                      <td className="p-4 space-x-2 whitespace-nowrap">
                        {journal.certified === 1 ? "" : journal.unitprice}
                      </td>
                      <td class="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">
                        <MdAdd className="text-white rounded-full bg-green-500 w-[50%] h-[50%]" />{" "}
                      </td>
                      <td class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <MdAdd className="text-white rounded-full bg-green-500 w-[50%] h-[50%]" />
                      </td>
                      <td class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <MdAdd className="text-white rounded-full bg-green-500 w-[50%] h-[50%]" />
                      </td>
                      <td class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <MdAdd className="text-white rounded-full bg-green-500 w-[50%] h-[50%]" />
                      </td>
                      <td className="p-4 space-x-2 whitespace-nowrap">
                        <MdAdd className="text-white rounded-full bg-green-500 w-[50%] h-[50%]" />
                      </td>
                      <td className="p-4 space-x-2 whitespace-nowrap">
                        <MdAdd className="text-white rounded-full bg-green-500 w-[50%] h-[50%]" />
                      </td>
                      <td className="p-4 space-x-2 whitespace-nowrap">
                        <FaPeopleGroup 
                        onClick={()=> navigate(`/user-transactions/lots_in_a_day_lot/${journal.cherry_lot_id}`)}
                        className="text-white rounded-full bg-green-500 w-[50%] h-[50%]" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 right-0 items-center w-full p-4 bg-white border-t border-gray-200 sm:flex sm:justify-between dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center mb-4 sm:mb-0">
          <a
            href="#"
            onClick={handlePrevPage}
            className="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              className="w-7 h-7"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
          <a
            href="#"
            onClick={handleNextPage}
            className="inline-flex justify-center p-1 mr-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              className="w-7 h-7"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            -{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {Math.min(
                currentPage * itemsPerPage,
                filteredTransaction?.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {filteredTransaction?.length}
            </span>
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <a
            href="#"
            onClick={handlePrevPage}
            className="inline-flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-green-500 hover:bg-green-700 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            <svg
              className="w-5 h-5 mr-1 -ml-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
            Previous
          </a>
          <a
            onClick={handleNextPage}
            href="#"
            className="inline-flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-green-500 hover:bg-green-700 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Next
            <svg
              className="w-5 h-5 ml-1 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
        </div>
      </div>

      {/* update drawer */}
      <UpdateItemDrawer />

      {/* Delete Product Drawer */}
      <DeleteItemDrawer />

      {/* Add Product Drawer */}
      <AddItemDrawer />
    </div>
  );
};

export default CwsDailyJournalsTable;
