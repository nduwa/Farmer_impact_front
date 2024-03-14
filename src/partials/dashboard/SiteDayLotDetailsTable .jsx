import React, { useState, useEffect } from "react";
import UpdateItemDrawer from "./UpdateItemDrawer";
import DeleteItemDrawer from "./DeleteItemDrawer";
import AddItemDrawer from "./AddItemDrawer";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTransactionsByJournal } from "../../redux/actions/transactions/transactionsByJournal.action";
import { removeTransaction } from "../../redux/actions/transactions/removeTransaction.action";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { fetchAllTransactions } from "../../redux/actions/transactions/allTransactions.action";


const SiteDayLotDeatilsTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const itemsPerPage = 20;
  const journalId = useParams();


  const [journals, setJournals] = useState([]);

  const { journal } = useSelector((state) => state.fetchAllTransactionsByJournal);
  const [isApproveButton, setIsApproveButton] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [allTransactions, setAllTransactions] = useState([]);
  const { transactions,loading } = useSelector((state) => state.fetchAllTransactions);
  const { decodedToken } = useSelector((state) => state.fetchToken);
  const {success} = useSelector((state) => state.approveJournal);


//all transactions
  useEffect(() => {
    dispatch(fetchAllTransactions(token));
  }, [dispatch]);

  useEffect(() => {
    if (transactions) {
      setAllTransactions(transactions.data);
    }
  }, [transactions]);
 


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
  
//single journal
    const filteredJournal = 
      getUniqueValues(allTransactions,journalId.journalId);
     
  
  const formatter = new Intl.NumberFormat('en-US');

//removing transaction
 //
  useEffect(() => {
    dispatch(
      fetchAllTransactionsByJournal(token, journalId.journalId)
    );
  }, [dispatch,token,journalId]);

  useEffect(() => {
    if (journal) {
      setJournals(journal.data);
    }
  }, [journal]);
  console.log("journalllleeeee",journals)
 

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


  const sumByJournal = calculateTotalKilogramsByJournal();

 

  const calculateTotalPrice = () => {
    const totalPriceByTransaction = {};

    journals.forEach((transaction) => {
      const transactionId = transaction.id;
      const totalPrice = transaction.kilograms*transaction.unitprice + transaction.bad_kilograms*transaction.bad_unit_price  || 0;

      if (!totalPriceByTransaction[transactionId]) {
        totalPriceByTransaction[transactionId] = 0;
      }

      totalPriceByTransaction[transactionId] = totalPrice;
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

  const getCertifiedTransactionsUnderJournal = (journal) => {
    return journals.filter((transaction) => {
      return transaction.certified === 1;
    });
  };
  const certifiedTransactionsUnderJournal = getCertifiedTransactionsUnderJournal(journal);
  console.log(`certified Transactions under journal:`, certifiedTransactionsUnderJournal);


  
  const getUnCertifiedTransactionsUnderJournal = (journal) => {
    return journals.filter((transaction) => {
      return transaction.certified === 0;
    });
  };

  const unCertifiedTransactionsUnderJournal = getUnCertifiedTransactionsUnderJournal(journal);
  console.log(`uncertified Transactions under journal:`, unCertifiedTransactionsUnderJournal);
  
  // Example usage:
  // paginatedTransactions.forEach((journal) => {
  //   const transactionsUnderJournal = getTransactionsUnderJournal(journal);
  //   console.log(`Transactions under journal ${journal.site_day_lot}:`, transactionsUnderJournal);
  // });
  


  const allPaperReceipts = journals.map(
    (transaction) => transaction.paper_receipt
  );

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

   
    journals.forEach((transaction) => {
      totalValues.transactionDate = transaction.transaction_date;

      totalValues.uploadedTime = transaction.uploaded_at;

      if (transaction.certified === 1) {
        totalValues.totalCertified += transaction.kilograms;
      } else {
        totalValues.totalUncertified += transaction.kilograms;
      }

      if (transaction.certified === 1) {
        totalValues.averagePrice = transaction.unitprice;
      } else {
        totalValues.averagePrice = transaction.bad_unit_price;
      }


      if (transaction.certified === 1) {  
      totalValues.totalCoffeeValue += totalValues.totalCertified*transaction.unitprice ;
      } else {
        totalValues.totalCoffeeValue += totalValues.totalUncertified*transaction.bad_unit_price ;
      }
      totalValues.totalFloaters += transaction.bad_kilograms;
      if (transaction.certified === 1) {     
        totalValues.totalKgs = totalValues.totalCertified +
        totalValues.totalFloaters;
        } else {
          totalValues.totalKgs = totalValues.totalUncertified +
          totalValues.totalFloaters;
        }
     
    });

    return totalValues;
  };
//calculating totals
  const totalValues = calculateTotalValues();
const calculateTotalCertifiedValues = () => {
  const totalCertifiedValues = {
    totalFloaters: 0,
    averagePrice: 0,
    totalCertified: 0,
    totalCoffeeValue: 0,
    totalUnTraceableKg: 0,
    totalKgs: 0,
    siteCollector: "",
  };

 
  journals.forEach((transaction) => {
    totalCertifiedValues.transactionDate = transaction.transaction_date;

    totalCertifiedValues.uploadedTime = transaction.uploaded_at;

    if(transaction.certified===1)
    {
      totalCertifiedValues.totalCertified += transaction.kilograms;
      totalCertifiedValues.totalFloaters += transaction.bad_kilograms;
      totalCertifiedValues.averagePrice = transaction.unitprice;
      totalCertifiedValues.totalCoffeeValue += transaction.kilograms*transaction.unitprice;
      totalCertifiedValues.totalKgs =
      totalCertifiedValues.totalCertified +
        totalCertifiedValues.totalFloaters;
      
    }
    
  });

  return totalCertifiedValues;
};
//calculating totals
const totalCertifiedValues = calculateTotalCertifiedValues();



const calculateTotalUncertifiedValues = () => {
  const totalUncertifiedValues = {
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

 
  journals.forEach((transaction) => {
    totalUncertifiedValues.transactionDate = transaction.transaction_date;

    totalUncertifiedValues.uploadedTime = transaction.uploaded_at;


      totalUncertifiedValues.totalUncertified += transaction.kilograms;
    if(transaction.certified === 0) {
      
    }
    totalUncertifiedValues.totalFloaters += transaction.bad_kilograms;
    totalUncertifiedValues.averagePrice = transaction.bad_unit_price;
    totalUncertifiedValues.totalCoffeeValue += transaction.bad_kilograms*transaction.bad_unit_price;
    totalUncertifiedValues.totalKgs =
      totalUncertifiedValues.totalUncertified +
      totalUncertifiedValues.totalFloaters;
  });

  return totalUncertifiedValues;
};
//calculating totals
const totalUncertifiedValues = calculateTotalUncertifiedValues();


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
  
 

  return (
    <div className="flex flex-col col-span-full xl:col-span-12">
      <div className="p-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
        <span className="font-large font-bold ml-12 ">
          Site collector Daily Journal Details
        </span>
        <div className="items-center justify-between block sm:flex md:divide-x md:divide-gray-100 dark:divide-gray-700">
          <div className="flex w-full items-center mb-4  sm:mb-0 ">
            <table className="min-w-full  divide-y divide-gray-200  mt-8 table-fixed dark:divide-gray-600 border border-gray-300 dark:border-gray-600">
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
                    {journalId.journalId}
                  </td>
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    FARMER PAYMENT TOTAL
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
                    {totalValues.totalCertified.toLocaleString()}
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
      <p className="mt-3 font-bold">Certified   Coffee</p>
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
                     BUY.DATE	
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      FTR	
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                     NAME
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      FARMER ID
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                  QTY
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                     AMT
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                     AV.PX	
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
             TX.TYPE	
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
                     CERT
                    </th>
                   
                  
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {certifiedTransactionsUnderJournal?.map((transaction, index) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                              {index+1}
                      </td>

                      <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                      {formatDate(transaction.uploaded_at)}
                      </td>
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {transaction.lotnumber}
                      </td>

                      <td class="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">
                        {transaction.farmername}
                      </td>
                      <td class="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {transaction.farmerid }
                      </td>
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        { transaction.kilograms}
                      </td>
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {transaction.cash_paid.toLocaleString()}
                      </td>
                      <td class="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {transaction.unitprice}
                      </td>
                      <td class="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {transaction.transaction_type}
                      </td>
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {isUniquePaperSlip(transaction.paper_receipt) ? (
                          <button className="w-8 h-8 rounded-full bg-green-500 text-white  flex items-center justify-center">
                            i
                          </button>
                        ) : (
                          <button className="w-8 h-8 rounded-full bg-red-500 text-white  flex items-center justify-center">
                            i
                          </button>
                        )}
                      </td>
                      <td class="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {transaction.certification}
                      </td>
                    </tr>
                    
                  ))}
                  <tr>
                  <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">
                      
                      </td>
                      <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">


                    </td>
                    <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">


                    </td>
                    <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">

                    </td>
                    <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">

                      </td>
                      <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">
                        {totalCertifiedValues.totalKgs.toLocaleString()} kgs
                      </td>
                      <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">
                       {totalCertifiedValues.totalCoffeeValue.toLocaleString()}

                    </td>
                    <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">

                     </td>
                        <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">

                        </td>
                        <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">

                      </td>
                       <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">
                         </td>
                         
                        
                      
                    
                  </tr>
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
      <p className="mt-3 font-bold">Uncertified   Coffee</p>
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
                     BUY.DATE	
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      FTR	
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                     NAME
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      FARMER ID
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                  QTY
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                     AMT
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                     AV.PX	
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
             TX.TYPE	
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
                     CERT
                    </th>
                   
                  
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {unCertifiedTransactionsUnderJournal?.map((transaction, index) => (
                    <tr
                    key={transaction.id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                    {index+1}
                    </td>

                    <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {formatDate(transaction.uploaded_at)}

                    </td>
                    <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                      {transaction.lotnumber}
                    </td>

                    <td class="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">
                      {transaction.farmername}
                    </td>
                    <td class="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                     {transaction.farmerid}
                    </td>
                    <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                    {transaction.bad_kilograms}
                    </td>
                    <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                      {transaction.cash_paid.toLocaleString()}
                    </td>
                   
                    <td class="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                      {transaction.bad_unit_price}
                    </td>
                    <td class="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                      {transaction.transaction_type}
                    </td>
                    <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                      {isUniquePaperSlip(transaction.paper_receipt) ? (
                        <button className="w-8 h-8 rounded-full bg-green-500 text-white  flex items-center justify-center">
                          i
                        </button>
                      ) : (
                        <button className="w-8 h-8 rounded-full bg-red-500 text-white  flex items-center justify-center">
                          i
                        </button>
                      )}
                    </td>
                    <td class="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                    {transaction.certification}
                    </td>
                   
                  
                  </tr>
                    
                  ))}
                  <tr>
                  <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">
                      TOTALS
                      </td>
                      <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">


                    </td>
                    <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">


                    </td>
                    <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">

                    </td>
                    <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">

                      </td>
                      <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">
                      {totalUncertifiedValues.totalKgs.toLocaleString()} kgs

                     </td>
                      <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">
                      {totalUncertifiedValues.totalCoffeeValue.toLocaleString()}
                     
                    </td>
                    <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white"></td>
                        <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">
                        </td>
                        <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white"></td>
                       <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">
                         </td>
                         
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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

export default SiteDayLotDeatilsTable;
