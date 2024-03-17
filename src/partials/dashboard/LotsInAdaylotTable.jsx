import React, { useState, useEffect } from "react";
import UpdateItemDrawer from "./UpdateItemDrawer";
import DeleteItemDrawer from "./DeleteItemDrawer";
import AddItemDrawer from "./AddItemDrawer";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllStaff } from "../../redux/actions/staff/getAllStaff.action";
import { fetchAllStation } from "../../redux/actions/station/allStations.action";
import "react-toastify/dist/ReactToastify.css";
import { fetchAllJournalsByCherryLotId } from "../../redux/actions/transactions/journalsByCherryLotId.action";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const LotsInAdaylotTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const itemsPerPage = 20;
  const cherryLotId = useParams();
  console.log("cherrylot", cherryLotId)

  const [journals, setJournals] = useState([]);
  const [allStation, setAllStation] = useState([]);
  const { result } = useSelector(
    (state) => state.fetchAllJournalsByCherryLotId
  );
  const [allJournals, setAllJournals] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [allStaff, setAllStaff] = useState([]);
  const { staffs } = useSelector((state) => state.fetchAllStaff);
  const { stations } = useSelector((state) => state.fetchAllStations);
  //all transactions
  useEffect(() => {
    dispatch(fetchAllJournalsByCherryLotId(token, cherryLotId.cherryLotId));
  }, [dispatch]);

  useEffect(() => {
    if (result) {
      setAllJournals(result.data);
    }
  }, [result]);

  useEffect(() => {
    dispatch(fetchAllStaff());
  }, [dispatch]);

  useEffect(() => {
    if (staffs) {
      setAllStaff(staffs.data);
    }
  }, [staffs]);
  useEffect(() => {
    dispatch(fetchAllStation());
  }, [dispatch]);

  useEffect(() => {
    if (stations) {
      setAllStation(stations.data);
    }
  }, [stations]);
  // Function to get unique values from an array
  const getUniqueValues = (arr, key) => {
    const uniqueValues = [];
    const uniqueKeys = new Set();

    arr?.forEach((item) => {
      const value = item[key];

      if (!uniqueKeys.has(value)) {
        uniqueKeys.add(value);
        uniqueValues.push(item);
      }
    });

    return uniqueValues;
  };

  const filteredJournals = getUniqueValues(allJournals, "site_day_lot");
  console.log("filtereddd", filteredJournals);

  const formatter = new Intl.NumberFormat("en-US");

  const getUserScIdById = (_kf_Staff) => {
    const staff = allStaff?.find((staff) => staff.__kp_Staff === _kf_Staff);
    return staff ? staff.userID : null;
  };

  const getUserNameById = (_kf_Staff) => {
    const staff = allStaff?.find((staff) => staff.__kp_Staff === _kf_Staff);
    return staff ? staff.Name : null;
  };

  const getStationName = (_kf_Station) => {
    const station = allStation?.find(
      (station) => station.__kp_Station === _kf_Station
    );
    return station ? station.Name : null;
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
      cherry: 0,
    };

    allJournals?.forEach((transaction) => {
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
      totalValues.cherry =
        totalValues.totalCertified + totalValues.totalUncertified;
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
  //calculating totals
  const totalValues = calculateTotalValues();
  const totalPages = Math.ceil(journals?.length / itemsPerPage);

  const paginatedjournals = filteredJournals?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const calculateTotalKilogramsByJournal = () => {
    const sumByJournal = {};

    // Iterate through transactions
    allJournals?.forEach((transaction) => {
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

  const calculateTotalPrice = () => {
    const totalPriceByJournal = {};

    allJournals?.forEach((transaction) => {
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
  console.log(totalPriceByJournal);

  const sumFloatersKG = () => {
    const sum = {};

    allJournals?.forEach((transaction) => {
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
    const price =
      transaction.certified === 1
        ? transaction.unitprice
        : transaction.bad_unit_price;
    const totalKgs = certifiedKG + uncertifiedKG + floatersKG;
    return {
      price,
      totalKgs,
    };
  };

  const certifications = filteredJournals?.map(
    (transaction) => transaction.certification
  );

  const dates = filteredJournals?.map(
    (transaction) => transaction.transaction_date
  );


  const getFarmerUnderJournal = (journal) => {
    const farmers = new Set(); // Using a Set to automatically maintain uniqueness
    
    allJournals.forEach((transaction) => {
      if (transaction.site_day_lot === journal.site_day_lot) {
        const farmerName = transaction.farmername;
        if (farmerName) {
          farmers.add(farmerName); // Add farmer name to the set
        }
      }
    });
    
    return Array.from(farmers); // Convert set to array and return
  };
  
  filteredJournals.forEach((journal) => {
    const farmersUnderJournal = getFarmerUnderJournal(journal);
    console.log(`Farmers under journal ${journal.site_day_lot}:`, farmersUnderJournal);
  });
  

  let totalFarmers = 0;

filteredJournals.forEach((journal) => {
  const farmersUnderJournal = getFarmerUnderJournal(journal);
  totalFarmers += farmersUnderJournal.length;
});

console.log("Total farmers contributed:", totalFarmers);


  const getTransactionsUnderJournal = (journal) => {
    return allJournals.filter((transaction) => {
      return transaction.site_day_lot === journal.site_day_lot;
    });
  };
  
  // Example usage:
  filteredJournals.forEach((journal) => {
    const transactionsUnderJournal = getTransactionsUnderJournal(journal);
    console.log(`Transactions under journal ${journal.site_day_lot}:`, transactionsUnderJournal);
  });
  
  const handleClickAction = (transaction) => {
    setSelectedUser(transaction);
    setShowTransactionModel(true);
  };

  //approving transaction
  const handleApprove = () => {
    dispatch(approveJoulnal(token, journalId.journalId))
      .then(() => {
        if (success) {
          navigate("/user-transaction");
        }
      })
      .catch((error) => {
        console.error("Error approving journal:", error);
      });
  };


  const handleDownload = () => {
    const table = document.querySelector(".table-fixed");
    const rows = table.querySelectorAll("tr");
  
    const data = [];
    
    
    const headers = Array.from(rows[0].querySelectorAll("th")).map(header => header.innerText);
    data.push(headers.join(","));
  
    rows.forEach((row, index) => {
      if (index !== 0) { 
        const rowData = [];
        const cells = row.querySelectorAll("td");
        cells.forEach((cell) => {
          rowData.push(cell.innerText);
        });
        data.push(rowData.join(","));
      }
    });
  
    const csvContent = "data:text/csv;charset=utf-8," + data.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Cherry_Lot_Summary.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  

  return (
    <div className="flex flex-col col-span-full xl:col-span-12">
      <div className="p-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
        <span className="font-large font-bold ml-12 ">Cherry lot summary</span>
        <div className="items-center justify-between block sm:flex md:divide-x md:divide-gray-100 dark:divide-gray-700">
          <div className="flex w-full items-center mb-4  sm:mb-0 ">
            <table className="min-w-full  divide-y divide-gray-200  mt-8  dark:divide-gray-600 border border-gray-300 dark:border-gray-600">
              <thead className=" dark:bg-gray-700">
                <tr className="border-b">
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r "
                  >
                    Cherry Lot ID
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                    {cherryLotId.cherryLotId}
                  </td>
                </tr>
                <tr className="border-b">
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    Certification(s)
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                    {certifications?.join(", ")}
                  </td>
                </tr>
                <tr className="border-b">
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    Lot Creation Date
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                    {dates[0]}
                  </td>
                </tr>
                <tr className="border-b">
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    Number of contributing site collectors
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                    {filteredJournals.length}
                  </td>
                </tr>
                <tr className="border-b">
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    Number of contributing farmers
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                    {totalFarmers}
                  </td>
                </tr>
                <tr className="border-b">
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    Avg Farmer Price per Kg Cherry
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                    {totalValues.averagePrice}
                  </td>
                </tr>
                <tr className="border-b">
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    Total Kgs Cherry Bought
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                    {totalValues.cherry.toLocaleString()}
                  </td>
                </tr>
                <tr className="border-b">
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    Total Kgs Rejected
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                    0
                  </td>
                </tr>
                <tr className="border-b">
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    Total Kgs Left
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                    {totalValues.totalKgs.toLocaleString()}
                  </td>
                </tr>
                <tr className="border-b">
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    Avg Transport Fee per Kg Cherry
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                    {/* {totalValues.averagePrice} */}
                  </td>
                </tr>
                <tr className="border-b">
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    Avg Transport Fee per Kg Floater
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                    {/* {totalValues.averagePrice} */}
                  </td>
                </tr>
                <tr className="border-b">
                  <th
                    scope="col"
                    className="p-4 text-xs font-bold text-left text-gray-500 uppercase dark:text-gray-400 border-r"
                  >
                    Avg Commission Fee per Kg Cherry
                  </th>
                  <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white border-r">
                    {/* {totalValues.averagePrice} */}
                  </td>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>
      <p className="mt-3 font-bold">Farmer Contributions</p>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="p-4">
                    CHERRY.LOT.NO	
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                     FARMER
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                     CERT.ID	
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                     	DELIVERY.SITE
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      KG.DELIVERED
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      FARMER.PYT
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
                      PAPER.RECEIPT
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                     PAYMENT TYPE
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                    EDITED.
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                
                    <tr
                    
                      className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                    Lorem ipsum 
                      </td>

                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                    Lorem ipsum 
                      </td>
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                    Lorem ipsum 
                      </td>

                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                    Lorem ipsum 
                      </td>
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                    Lorem ipsum 
                      </td>
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                    Lorem ipsum 
                      </td>
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                    Lorem ipsum 
                      </td>
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                    Lorem ipsum 
                      </td>
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                    Lorem ipsum 
                      </td>
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                    No
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
              {Math.min(currentPage * itemsPerPage, filteredJournals?.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {filteredJournals?.length}
            </span>
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center">
      <button className="bg-green-500 p-4 mt-5 rounded-lg text-white" onClick={handleDownload}>
  DOWNLOAD REPORT
</button>

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

export default LotsInAdaylotTable;
