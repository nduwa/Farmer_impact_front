import React, { useState, useEffect } from "react";
import UpdateItemDrawer from "./UpdateItemDrawer";
import DeleteItemDrawer from "./DeleteItemDrawer";
import AddItemDrawer from "./AddItemDrawer";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchAllTransactions } from "../../redux/actions/coffeePurchase/allTransactionsAction";
import { fetchAllStaff } from "../../redux/actions/coffeePurchase/allTransactionsAction";

const TransactionDetailsTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [allTransactions, setAllTransactions] = useState([]);
  const { transactions } = useSelector((state) => state.fetchAllStaff);
  const [allStaff, setAllStaff] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState();
  const { staffs } = useSelector((state) => state.fetchAllStaff);
  const token = localStorage.getItem("token");
  const itemsPerPage = 20;

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
    dispatch(fetchAllStaff());
  }, [dispatch]);

  useEffect(() => {
    if (staffs) {
      setAllStaff(staffs.data);
    }
  }, [staffs]);
  console.log("transactionWEFSERFERs", allStaff);

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

  // const filteredTransaction = searchQuery
  //   ? allTransactions?.filter((transaction) =>
  //       Object.values(transaction).some(
  //         (value) =>
  //           typeof value === "string" &&
  //           value.toLowerCase().includes(searchQuery?.toLowerCase())
  //       )
  //     )
  //   : allTransactions;

  const filteredTransaction = searchQuery
    ? getUniqueValues(
        allTransactions?.filter((transaction) =>
          Object.values(transaction).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchQuery?.toLowerCase())
          )
        ),
        "site_day_lot"
      )
    : getUniqueValues(allTransactions, "site_day_lot");
    console.log("transactions",filteredTransaction.length)

  const getUserScIdById = (_kf_Staff) => {
    const staff = allStaff?.find((staff) => staff.__kp_Staff === _kf_Staff);
    return staff ? staff.userID : null;
  };

  const getUserNameById = (_kf_Staff) => {
    const staff = allStaff?.find((staff) => staff.__kp_Staff === _kf_Staff);
    return staff ? staff.Name : null;
  };

  const calculateTotalKilogramsByJournal = () => {
    const sumByJournal = {};

    // Iterate through transactions
    allTransactions.forEach((transaction) => {
      const journal = transaction.site_day_lot;
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

  console.log("Sum of Kilograms by JOURNAL#:", sumByJournal);

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

  console.log("Sum of Kilograms by JOURNAL#:", sumByJournal);

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
  console.log("paperr", allPaperReceipts);

  const isUniquePaperSlip = (paperReceipt) => {
    const occurrences = allPaperReceipts.filter(
      (value) => value === paperReceipt
    ).length;
    console.log("occccccc", occurrences);

    return occurrences === 1;
  };

  return (


    <div className="flex flex-col col-span-full xl:col-span-12">
      <div className="p-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <span className="font-large font-bold ml-12 ">Site collector Daily Journal</span>
        <div className="items-center justify-between block sm:flex md:divide-x md:divide-gray-100 dark:divide-gray-700">
   
          <div className="flex  items-center mb-4 -ml-3 sm:mb-0 ">
           
          <table className="min-w-full divide-y divide-gray-200 ml-14 mt-8 table-fixed dark:divide-gray-600 border border-gray-300 dark:border-gray-600">
        
        
  <thead className=" dark:bg-gray-700">
    <tr className="border-b">
      <th
        scope="col"
        className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r "
      >
        UPLOADED TIME
      </th>
      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
        June, 20 2023 07:33 AM
      </td>
      <th
        scope="col"
        className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
      >
        TRANSACTION DATE
      </th>
      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
        June, 19 2023
      </td>
    </tr>
    <tr className="border-b">
      <th
        scope="col"
        className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
      >
        UPLOADED TIME
      </th>
      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
        June, 20 2023 07:33 AM
      </td>
      <th
        scope="col"
        className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
      >
        TRANSACTION DATE
      </th>
      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
        June, 19 2023
      </td>
    </tr>
    <tr className="border-b">
      <th
        scope="col"
        className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
      >
        UPLOADED TIME
      </th>
      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
        June, 20 2023 07:33 AM
      </td>
      <th
        scope="col"
        className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
      >
        TRANSACTION DATE
      </th>
      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
        June, 19 2023
      </td>
    </tr>
    <tr className="border-b">
      <th
        scope="col"
        className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
      >
        UPLOADED TIME
      </th>
      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
        June, 20 2023 07:33 AM
      </td>
      <th
        scope="col"
        className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
      >
        TRANSACTION DATE
      </th>
      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
        June, 19 2023
      </td>
    </tr>
    <tr className="border-b">
      <th
        scope="col"
        className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
      >
        UPLOADED TIME
      </th>
      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
        June, 20 2023 07:33 AM
      </td>
      <th
        scope="col"
        className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
      >
        TRANSACTION DATE
      </th>
      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
        June, 19 2023
      </td>
    </tr>
    <tr className="border-b">
      <th
        scope="col"
        className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
      >
        UPLOADED TIME
      </th>
      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
        June, 20 2023 07:33 AM
      </td>
      <th
        scope="col"
        className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
      >
        TRANSACTION DATE
      </th>
      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
        June, 19 2023
      </td>
    </tr>
  </thead>
</table>

          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                 <th scope="col" className="p-4">
                      #   
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      BUY DATE
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      JOURNAL#
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      SC.NAME
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      SC.ID
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      CERTIFIED.KG
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      UNCERTIFIED.KG
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      FLOATERS.KG
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      TOTAL KG PURCHASED
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      PAYMENTS.MADE
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
                      CHERRY DAY LOT
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {paginatedTransactions?.map((transaction, index) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {isUniquePaperSlip ? (
                          <button className="w-8 h-8 rounded-full bg-green-500 text-white  flex items-center justify-center">
                            i
                          </button>
                        ) : (
                          <button className="w-8 h-8 rounded-full bg-red-500 text-white  flex items-center justify-center">
                            i
                          </button>
                        )}
                      </td>

                      <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                        {transaction.transaction_date}
                      </td>
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        <a
                          href={`your_link_destination_here/${transaction.site_day_lot}`}
                          className="text-blue-500 hover:text-gray-500"
                        >
                          #{transaction.site_day_lot}
                        </a>
                      </td>

                      <td class="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">
                        <a
                          href=""
                          className="text-blue-500 hover:text-gray-500"
                        >
                          {getUserNameById(transaction._kf_Staff)}
                        </a>
                      </td>
                      <td class="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {getUserScIdById(transaction._kf_Staff)}
                      </td>
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {transaction.certified === 1
                          ? sumByJournal[
                              transaction.site_day_lot
                            ].toLocaleString()
                          : 0}
                      </td>
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {transaction.certified === 1
                          ? 0
                          : sumByJournal[
                              transaction.site_day_lot.toLocaleString()
                            ]}
                      </td>
                      <td class="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {floatersSum[transaction.site_day_lot].toLocaleString()}
                      </td>
                      <td class="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {calculateTotalKilogramsPurchased(
                          transaction
                        ).toLocaleString()}
                      </td>
                      <td class="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {totalPriceByJournal[
                          transaction.site_day_lot
                        ].toLocaleString()}
                      </td>
                      <td class="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {transaction.approved === 1 ? (
                          <button className="bg-green-500 text-white w-24 h-8 rounded-md">Approved</button>

                          // <p className="bg-green-500 text-white">Approved</p>
                        ) : (
                          <button className="bg-orange-300 text-white w-24 h-8 rounded-md">Pending...</button>
                        )}
                      </td>
                      <td class="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {transaction.parchment_lot_id}
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
            className="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={handlePrevPage}
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
            className="inline-flex justify-center p-1 mr-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={handleNextPage}
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
              {Math.min(currentPage * itemsPerPage, filteredTransaction?.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {filteredTransaction?.length}
            </span>
          </span>
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

export default TransactionDetailsTable;
