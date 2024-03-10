import React, { useState, useEffect } from "react";
import UpdateItemDrawer from "./UpdateItemDrawer";
import DeleteItemDrawer from "./DeleteItemDrawer";
import AddItemDrawer from "./AddItemDrawer";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import EditTransactionModel from "../../components/EditTransactionModel";
import RemoveTransactionModel from "../../components/RemoveTransactionModel";
import { fetchAllTransactionsByJournal } from "../../redux/actions/transactions/transactionsByJournal.action";
import { removeTransaction } from "../../redux/actions/transactions/removeTransaction.action";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { fetchAllTransactions } from "../../redux/actions/transactions/allTransactions.action";
// import { CommisionPrice } from "../../redux/actions/transactions/addCommissionPrice.action";
import { CommisionFees } from "../../redux/actions/transactions/addCommissinFees";
import { addCommission } from "../../redux/actions/transactions/commission.action";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TransactionDetailsTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const itemsPerPage = 20;
  const journalId = useParams();


  const [journals, setJournals] = useState([]);

  const { journal } = useSelector((state) => state.fetchAllTransactionsByJournal);
  const { price } = useSelector((state) => state.addCommissionPrice);
  const { commission,success } = useSelector((state) => state.commissionFees);
  const { removeTransactionData } = useSelector((state) => state.fetchAllStaff);
  const [isCommissionFeesAdded, setIsCommissionFeesAdded] = useState(false)
  const [isCommissionPriceAdded, setIsCommissionPriceAdded] = useState(false)
  const [isApproveButton, setIsApproveButton] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [transactionIdToDelete, setTransactionIdToDelete] = useState(null);
  const [showTransactionModel, setShowTransactionModel] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  const { transactions,loading } = useSelector((state) => state.fetchAllTransactions);
  const { decodedToken } = useSelector((state) => state.fetchToken);

  const [additionalInfo, setAdditionalInfo] = useState({
    commissionFee:10,
    transportFee:10,
    commissionUntraced:10,
    transportCherry:10,
    transportFloaters:10,

  })



  useEffect(() => {
    dispatch(fetchAllTransactions(token));
  }, [dispatch]);

  useEffect(() => {
    if (transactions) {
      setAllTransactions(transactions.data);
    }
  }, [transactions]);
  console.log("transactions", allTransactions);


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
  
  
    const filteredJournal = 
      getUniqueValues(allTransactions,journalId.journalId);
      console.log("transactionsdfdfdfxf",filteredJournal)
  
  const formatter = new Intl.NumberFormat('en-US');

     console.log("comission",commission)
// console.log("adddd", commission.commissionCertified)
  const openModal = (transactionId) => {
    setTransactionIdToDelete(transactionId)
   
    setModalOpen(true);
  };

  const closeModal = () => {
    setTransactionIdToDelete(null)
    setModalOpen(false);
  };
  
  const handleConfirmDelete = (transactionId) => {
    
    if (transactionIdToDelete) {
      dispatch(removeTransaction(token, transactionIdToDelete));
    }
  
    if(removeTransactionData){
      
    }
  
    console.log(`Deleting transaction with ID: ${transactionId}`);
    closeModal(); // Close the modal after deletion
  };
  useEffect(() => {
    
    if (removeTransactionData) {
      dispatch(
        fetchAllTransactionsByJournal(token, journalId.journalId.replace(":", ""))
      );
    }
  }, [removeTransactionData,dispatch]); 

 

  

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
        totalValues.totalUncertified = 0;
      } else {
        totalValues.totalUncertified += transaction.kilograms;
        totalValues.totalCertified = 0;
      }
      totalValues.totalFloaters += transaction.bad_kilograms;
      totalValues.averagePrice = transaction.unitprice;
      totalValues.totalCoffeeValue += transaction.kilograms*transaction.unitprice + transaction.bad_kilograms*transaction.bad_unit_price;
      totalValues.totalKgs =
      totalValues.totalCertified +
        totalValues.totalUncertified +
        totalValues.totalFloaters;
    });

    return totalValues;
  };

  const totalValues = calculateTotalValues();
  const totalCommission = additionalInfo.commissionFee * totalValues.totalKgs
  const transportFeesCherry = additionalInfo.transportFee * totalValues.totalCertified 
  const transportFeesFloaters  = additionalInfo.transportFee* totalValues.totalFloaters
  const totals = totalCommission + transportFeesCherry + transportFeesFloaters
  
 
  
 



const formatNumberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};


const formattedTransportFeesCherry= formatNumberWithCommas(transportFeesCherry)
console.log("formaaa",formattedTransportFeesCherry)



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
 

  const handleTransactionUpdate = (userId, newPassword) => {
   
    setSelectedUser(null);
    setShowTransactionModel(true);
  };


  const handleAdditionalInfoChange = (e) => {
    const { name, value } = e.target;
    setAdditionalInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  
  const handleAdditionalInfoSubmit = async (e) => {
    e.preventDefault();
    try {
       dispatch(addCommission(  additionalInfo));
      // toast.success("commission");
      console.log("fjvhdfv",additionalInfo)
      setIsCommissionPriceAdded(true)
    
  
    } catch (error) {
      console.error("Update failed:", error);
      // toast.error("Failed to update transaction");
    }
  };


  const handleCommissionFeesSubmit = async (e) => {
    e.preventDefault();
    try {
       dispatch(CommisionFees(token,{
        commission_fees: totalCommission,
        // transportCherry: transportFeesCherry,
        floater_transport_fee: transportFeesFloaters,
        created_at: Date.now(),
        created_by: decodedToken.user.id,
        _kf_Supplier: filteredJournal[0]._kf_Supplier,
        _kf_Station: filteredJournal[0]._kf_Station,
        day_lot_number: filteredJournal[0].DayLotNumber,
        UserID: decodedToken.staff.userID,
        site_cherry_price: filteredJournal[0].unitprice,
        site_cherry_kgs: totalValues.totalCertified + totalValues.totalUncertified,
        site_Floater_kgs: totalValues.totalFloaters,
        site_Floater_price: filteredJournal[0].bad_unit_price,
        transport_fees: additionalInfo.transportFee,
        site_total_payment: totals,
        site_day_lot:filteredJournal[0].site_day_lot,
        status:0
      
      }));
    
    
      setIsCommissionFeesAdded(true)
      setIsApproveButton(true)
  
    } catch (error) {
      console.error("Update failed:", error);
   
    }
  };

  return (
    <div className="flex flex-col col-span-full xl:col-span-12">
      <div className="p-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
        <span className="font-large font-bold ml-12 ">
          Site collector Daily Journal
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
                            onSubmit={handleTransactionUpdate}
                          />
                        )}

                        <button
                          type="button"
                          id="deleteProductButton"
                          onClick={() =>
                           openModal(transaction.id)
                          }
                          data-drawer-target="drawer-delete-product-default"
                          data-drawer-show="drawer-delete-product-default"
                          aria-controls="drawer-delete-product-default"
                          data-drawer-placement="right"
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-300 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                        >
                          <RiDeleteBin6Line />
                        </button>
                        
                        <RemoveTransactionModel
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirmDelete={handleConfirmDelete}
        transactionId={transactionIdToDelete}
      />
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

                      {totalValues.totalCertified.toLocaleString()}</td>
                      <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">

                      {totalValues.totalUncertified}</td>
                      <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">


                    </td>
                    <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">

                        {totalValues.totalFloaters.toLocaleString()}</td>
                        <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">

                        </td>
                        <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">

                       {totalValues.totalKgs.toLocaleString()}</td>
                       <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">
                         </td>
                          <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">

                         {totalValues.totalCoffeeValue.toLocaleString()}</td>
                         <td className="p-4 text-base font-bold   whitespace-nowrap dark:text-white">
                         {totalValues.totalCoffeeValue.toLocaleString()}
                         </td>
                         <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white"> 
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
      {isCommissionFeesAdded &&(
                  <div className="flex justify-center items-center">
                  <button
                    className="bg-green-500 text-white p-2 m-2"
                    onClick={handleCommissionFeesSubmit}
                  >Approve Transaction</button>
                </div>
                )}
      <p className="mt-3 font-bold">Additional Info</p>
      <div className="items-center  bg-white justify-between block sm:flex md:divide-x md:divide-gray-100 dark:divide-gray-700">
          <div className="flex w-full gap-5 mb-4  sm:mb-0 ">
          <table className="min-w-[70%] divide-y divide-gray-200  mt-8 table-fixed dark:divide-gray-600 border border-gray-300 dark:border-gray-600">
              <thead className=" dark:bg-gray-700">
                {!isCommissionPriceAdded &&(
                    <><><tr className="border-b hover:bg-gray-100">
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    Commission Fees
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">

                    <input
                      type="text"
                      name="commissionFee"

                      value={additionalInfo.commissionFee}

                      placeholder=""
                      className="rounded-lg   w-80"
                      onChange={handleAdditionalInfoChange} />

                  </td>

                </tr><tr className="border-b hover:bg-gray-100">
                    <th
                      scope="col"
                      className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                    >
                      Transport Fees
                    </th>
                    <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                      <input type="number"
                        value={additionalInfo.transportFee}
                        className="rounded-lg w-80"
                        name="transportFee"
                        onChange={handleAdditionalInfoChange} />

                    </td>

                  </tr></>
                  {/* <tr className="border-b hover:bg-gray-100">
                    <th
                      scope="col"
                      className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                    >
                      Commission for untraceable coffee
                    </th>
                    <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                      <input type="number"
                        value={additionalInfo.commissionUntraced}
                        className="rounded-lg w-80"
                        name="commissionUntraced"
                        onChange={handleAdditionalInfoChange} />
                    </td>

                  </tr><tr className="border-b hover:bg-gray-100">
                    <th
                      scope="col"
                      className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                    >
                      Transport Fee (Cherries)
                    </th>
                    <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                      <input type="number"
                        value={additionalInfo.transportCherry}
                        className="rounded-lg w-80"
                        name="transportCherry"
                        onChange={handleAdditionalInfoChange} />

                    </td>

                  </tr><tr className="border-b">
                    <th
                      scope="col"
                      className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                    >
                      Transport Fee (Floaters)
                    </th>
                    <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                      <input
                        type="number"
                        value={additionalInfo.transportFloaters}
                        className="rounded-lg w-80"
                        onChange={handleAdditionalInfoChange}
                        name="transportFloaters" />

                    </td>

                  </tr><tr className="border-b hover:bg-gray-100">
                    <th
                      scope="col"
                      className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                    >
                      Total site collector payment
                    </th>
                    <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                      <input
                        type="number"
                        value={total}
                        className="rounded-lg  w-80"
                        name="commissionCertified"
                        onChange={handleAdditionalInfoChange} />

                    </td>

                  </tr> */}
                  <div className="flex justify-center items-center">
                    <button
                      className="bg-green-500 text-white p-2 m-2"
                      onClick={handleAdditionalInfoSubmit}
                    >Save Data</button>
                  </div></> 

                )}

{isCommissionPriceAdded  && !isApproveButton &&(
                    <><><tr className="border-b hover:bg-gray-100">
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    Commission
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">

                    <input
                      type="text"
                      name="commissionCertified"

                      value={totalCommission.toLocaleString()}

                      placeholder=""
                      className="rounded-lg   w-80"
                      // onChange={handleAdditionalInfoChange}
                       />

                  </td>

                </tr>
                <tr className="border-b hover:bg-gray-100">
                    <th
                      scope="col"
                      className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                    >
                      Transport Fee (Cherries)
                    </th>
                    <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                      <input type="text"
                        value={transportFeesCherry.toLocaleString()}
                        className="rounded-lg w-80"
                        name="transportCherry"
                        // onChange={handleAdditionalInfoChange}
                         />

                    </td>

                  </tr>
                  <tr className="border-b">
                    <th
                      scope="col"
                      className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                    >
                      Transport Fee (Floaters)
                    </th>
                    <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                      <input
                        type="text"
                        name="transportFloaters"
                        value={transportFeesFloaters.toLocaleString()}
                        className="rounded-lg w-80"
                        // onChange={handleAdditionalInfoChange}
                         />

                    </td>

                  </tr>

                </>
              

                  <tr className="border-b hover:bg-gray-100">
                    <th
                      scope="col"
                      className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                    >
                      Total site collector payment
                    </th>
                    <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                      <input
                        type="text"
                        name="commissionCertified"

                        value={totals.toLocaleString()}
                        className="rounded-lg  w-80"
                        // onChange={handleAdditionalInfoChange}
                        />

                    </td>

                  </tr><div className="flex justify-center items-center">
                    <button
                      className="bg-green-500 text-white p-2 m-2"
                      onClick={handleCommissionFeesSubmit}
                    >Save Data</button>
                  </div>
                  </>

                )}
               
               
             
             
              </thead>
         
 </table>
          
            <div className=" mt-8 ">
            <input type="file" name="" id="" />
            <button className=" border border-green-500 hover:bg-green-500 hover:text-white text-green-500 p-1 mt-1">upload Joulnal</button>

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

export default TransactionDetailsTable;
