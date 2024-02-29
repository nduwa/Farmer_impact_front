import React, { useState, useEffect } from "react";
import UpdateItemDrawer from "./UpdateItemDrawer";
import DeleteItemDrawer from "./DeleteItemDrawer";
import AddItemDrawer from "./AddItemDrawer";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import EditTransactionModel from "../../components/EditTransactionModel";
import "react-toastify/dist/ReactToastify.css";

import { fetchAllTransactionsByJournal } from "../../redux/actions/coffeePurchase/allTransactionsAction";

import { MdModeEdit } from "react-icons/md";

import { RiDeleteBin6Line } from "react-icons/ri";

const TransactionDetailsTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [journals, setJournals] = useState([]);

  const { journal } = useSelector((state) => state.fetchAllStaff);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showTransactionModel, setShowTransactionModel] = useState(false);
  const token = localStorage.getItem("token");
  const itemsPerPage = 20;
  const journalId = useParams();

  console.log(journal);

  useEffect(() => {
    dispatch(
      fetchAllTransactionsByJournal(token, journalId.journalId.replace(":", ""))
    );
  }, [dispatch]);

  useEffect(() => {
    if (journal) {
      setJournals(journal.data);
    }
  }, [journal]);

  const calculateTotalKilogramsByJournal = () => {
    const sumByJournal = {};

    // Iterate through transactions
    journals.forEach((transaction) => {
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

  // console.log("Sum of Kilograms by JOURNAL#:", sumByJournal);

  const calculateTotalPrice = () => {
    const totalPriceByTransaction = {};

    journals.forEach((transaction) => {
      const transactionId = transaction.id;
      const cash = transaction.cash_paid || 0;

      if (!totalPriceByTransaction[transactionId]) {
        totalPriceByTransaction[transactionId] = 0;
      }

      totalPriceByTransaction[transactionId] += cash;
    });

    return totalPriceByTransaction;
  };

  const totalPriceByTransaction = calculateTotalPrice();

  const calculateTotalMomoAmount = () => {
    const totalMomoAmountByTransaction = {};

    journals.forEach((transaction) => {
      const transactionId = transaction.id;
      const cash = transaction.total_mobile_money_payment_paid || 0;

      if (!totalMomoAmountByTransaction[transactionId]) {
        totalMomoAmountByTransaction[transactionId] = 0;
      }

      totalMomoAmountByTransaction[transactionId] += cash;
    });

    return totalMomoAmountByTransaction;
  };

  const totalMomoAmountByTransaction = calculateTotalMomoAmount();

  // console.log("Sum of Kilograms by JOURNAL#:", sumByJournal);

  const calculateTotalKilogramsPurchased = (transaction) => {
    const certifiedKG =
      transaction.certified === 1 ? transaction.kilograms || 0 : 0;
    const uncertifiedKG =
      transaction.certified === 1 ? 0 : transaction.kilograms || 0;
    const floatersKG = transaction.bad_kilograms || 0;

    return certifiedKG + uncertifiedKG + floatersKG;
  };

  const totalPages = Math.ceil(journals?.length / itemsPerPage);

  const paginatedTransactions = journals?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const allPaperReceipts = journals.map(
    (transaction) => transaction.paper_receipt
  );

  const isUniquePaperSlip = (paperReceipt) => {
    const occurrences = allPaperReceipts.filter(
      (value) => value === paperReceipt
    ).length;
    console.log("occccccc", occurrences);

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

    // Iterate through transactions
    journals.forEach((transaction) => {
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
      totalValues.totalCoffeeValue += transaction.cash_paid;
      totalValues.totalKgs =
        totalValues.totalCertified +
        totalValues.totalUncertified +
        totalValues.totalFloaters;
    });

    return totalValues;
  };

  // Call the calculateTotalValues function to get the total values
  const totalValues = calculateTotalValues();

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
    };

    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );
  };
  const handleClickAction = (transaction) => {
    setSelectedUser(transaction);
    setShowTransactionModel(true);
  };
  console.log("rwtytry",selectedUser)

  const handlePasswordUpdate = (userId, newPassword) => {
   
    setSelectedUser(null);
    setShowTransactionModel(true);
  };
  return (
    <div className="flex flex-col col-span-full xl:col-span-12">
      <div className="p-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
        <span className="font-large font-bold ml-12 ">
          Site collector Daily Journal
        </span>
        <div className="items-center justify-between block sm:flex md:divide-x md:divide-gray-100 dark:divide-gray-700">
          <div className="flex  items-center mb-4 -ml-3 sm:mb-0 ">
            <table className="min-w-full  divide-y divide-gray-200 ml-14 mt-8 table-fixed dark:divide-gray-600 border border-gray-300 dark:border-gray-600">
              <thead className=" dark:bg-gray-700">
                <tr className="border-b">
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r "
                  >
                    UPLOADED TIME
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                    {formatDate(totalValues.uploadedTime)}
                  </td>
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    TRANSACTION DATE
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                    {totalValues.transactionDate}
                  </td>
                </tr>
                <tr className="border-b">
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    SITE COLLECTOR NAME
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                    {journal?.staffData[0].Name}
                  </td>
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    SITE COLLECTOR ID
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                    {journal?.staffData[0].userID}
                  </td>
                </tr>
                <tr className="border-b">
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    SC DAILY JOURNAL LOT
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                    {journalId.journalId.replace(":", "")}
                  </td>
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    COFFEE VALUE
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                    {totalValues.totalCoffeeValue.toLocaleString()}
                  </td>
                </tr>
                <tr className="border-b">
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    AVERAGE PRICE
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                    {totalValues.averagePrice}
                  </td>
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    CERTIFIED KG
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                    {totalValues.totalCertified}
                  </td>
                </tr>
                <tr className="border-b">
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    UNCERTIFIED KG
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                    {totalValues.totalUncertified}
                  </td>
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    UNTRACEABLE KG
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                    {totalValues.totalUncertified}
                  </td>
                </tr>
                <tr className="border-b">
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    FLOATERS KG
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                    {totalValues.totalFloaters}
                  </td>
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    TOTAL KG
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                    {totalValues.totalKgs.toLocaleString()}
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
                      FLAG
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      FARMER.ID
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      FARMER.NAME
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      PAPER.RECEIPT
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      KG.CERT
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      KG.UNCERT
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      PX.PER.KG
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      FLOATER.KG
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      FLOATER.PX
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      TOTAL.KG
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
                      TOTAL
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      CASH
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      MOBILE
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      ACTION
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
                        {transaction.farmerid}
                      </td>
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {transaction.farmername}
                      </td>

                      <td class="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">
                        {transaction.paper_receipt}
                      </td>
                      <td class="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {transaction.certified === 1
                          ? transaction.kilograms
                          : 0}
                      </td>
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {transaction.certified === 1
                          ? 0
                          : transaction.kilograms}
                      </td>
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {transaction.unitprice}
                      </td>
                      <td class="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {transaction.bad_kilograms}
                      </td>
                      <td class="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {transaction.bad_unit_price}
                      </td>
                      <td class="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {calculateTotalKilogramsPurchased(
                          transaction
                        ).toLocaleString()}
                      </td>
                      <td class="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {transaction.transaction_date}
                      </td>
                      <td class="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {totalPriceByTransaction[
                          transaction.id
                        ]?.toLocaleString()}
                      </td>
                      <td class="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {totalPriceByTransaction[
                          transaction.id
                        ]?.toLocaleString()}
                      </td>
                      <td class="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {totalMomoAmountByTransaction[
                          transaction.id
                        ]?.toLocaleString()}
                      </td>
                      <td className="p-4 space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          id="updateProductButton"
                          data-drawer-target="drawer-update-product-default"
                          data-drawer-show="drawer-update-product-default"
                          aria-controls="drawer-update-product-default"
                          data-drawer-placement="right"
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-green-500 hover:bg-green-400 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                          onClick={() => handleClickAction(transaction)}
                        >
                          <MdModeEdit />
                        </button>
                        {showTransactionModel && selectedUser && (
                          <EditTransactionModel
                            transaction={selectedUser}
                            onClose={() => setShowTransactionModel(false)}
                            onSubmit={handlePasswordUpdate}
                          />
                        )}

                        <button
                          type="button"
                          id="deleteProductButton"
                          onClick={() =>
                            navigate(
                              `/user-administaration/access-controll/mobile-access/${staff.id}`
                            )
                          }
                          data-drawer-target="drawer-delete-product-default"
                          data-drawer-show="drawer-delete-product-default"
                          aria-controls="drawer-delete-product-default"
                          data-drawer-placement="right"
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-300 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                        >
                          <RiDeleteBin6Line />
                        </button>
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
              {Math.min(currentPage * itemsPerPage, journals?.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {journals?.length}
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
