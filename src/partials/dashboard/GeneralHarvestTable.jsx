import React, { useState, useEffect } from "react";
import UpdateItemDrawer from "./UpdateItemDrawer";
import DeleteItemDrawer from "./DeleteItemDrawer";
import AddItemDrawer from "./AddItemDrawer";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchGeneralHarvests } from "../../redux/actions/generalHarvest/allGeneralHarvest.action";
import { fetchAllStation } from "../../redux/actions/station/allStations.action";
import { fetchAllSeasons } from "../../redux/actions/seasons/allSeasons.action";
const GeneralHarvestTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [transactionData, setTransactionData] = useState(null);
  const [farmerData, setFarmerData] = useState(null);
  const [houseHoldData, setHouseHoldData] = useState(null);
  const [season, setSeason] = useState(null);
  const [groupData, setGroupData] = useState(null);
  const { generalHarvest, loading } = useSelector(
    (state) => state.fetchAllGeneralHarvest
  );
  const [currentPage, setCurrentPage] = useState(1);
  const { stations } = useSelector((state) => state.fetchAllStations);
  const { seasons } = useSelector((state) => state.fetchAllSeasons);
  const [allStation, setAllStation] = useState([]);
  const [allSeasons, setAllSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedStation, setSelectedStation] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [searchQuery, setSearchQuery] = useState();

  useEffect(() => {
    if (!generalHarvest) {
      const data = {
        season: "",
        station: "",
      };
      dispatch(fetchGeneralHarvests(data));
    }
  }, [dispatch, generalHarvest]);

  // useEffect(() => {
  //   if (generalHarvest ) {
  //     setTransactionData(generalHarvest.transactions);
  //     setFarmerData(generalHarvest.farmer);
  //     setGroupData(generalHarvest.group);
  //     setHouseHoldData(generalHarvest.houseHold);
  //     setSeason(generalHarvest.seasons)
  //   }
  // }, [generalHarvest])

  // console.log("transactionData", transactionData)
  // console.log("householddata", houseHoldData)
  // console.log("farmerdata", farmerData)
  // console.log("group", groupData)

  const handleStationChange = (e) => {
    setSelectedStation(e.target.value);
  };

  useEffect(() => {
    if (selectedStation) {
      const data = {
        season: selectedSeason,
        station: selectedStation,
      };
      dispatch(fetchGeneralHarvests(data));
      console.log("stataaa",data)
    }
  }, [selectedStation]);

  const handleSeasonChange = (e) => {
    setSelectedSeason(e.target.value);
  };

  useEffect(() => {
    if (selectedSeason) {
      const data = {
        season: selectedSeason,
        station: selectedStation,
      };
      dispatch(fetchGeneralHarvests(data));
    }
  }, [selectedSeason]);

  useEffect(() => {
    if (generalHarvest) {
      setTransactionData(generalHarvest.transactions);
      setFarmerData(generalHarvest.farmer);
      setGroupData(generalHarvest.group);
      setHouseHoldData(generalHarvest.houseHold);
      setSeason(generalHarvest.seasons);
    }
  }, [generalHarvest]);

  console.log("transactionData", transactionData);
  // console.log("householddata", houseHoldData);
  console.log("farmerdata", farmerData);
  // console.log("group", groupData);

  useEffect(() => {
    dispatch(fetchAllStation());
  }, [dispatch]);

  useEffect(() => {
    if (stations) {
      setAllStation(stations.data);
    }
  }, [stations]);

  useEffect(() => {
    dispatch(fetchAllSeasons());
  }, [dispatch]);

  useEffect(() => {
    if (seasons) {
      setAllSeasons(seasons.data);
    }
  }, [seasons]);

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

  let filterdFarmers = searchQuery
    ? getUniqueValues(
        farmerData?.filter((farmer) =>
          Object.values(farmer).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchQuery?.toLowerCase())
          )
        ),
        "farmerid"
      )
    : getUniqueValues(farmerData, "farmerid");

  let filteredStation = searchQuery
    ? getUniqueValues(
        allStation?.filter((station) =>
          Object.values(station).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchQuery?.toLowerCase())
          )
        ),
        "Name"
      )
    : getUniqueValues(allStation, "Name");

  let filteredSeasons = searchQuery
    ? getUniqueValues(
        allSeasons?.filter((season) =>
          Object.values(season).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchQuery?.toLowerCase())
          )
        ),
        "Label"
      )
    : getUniqueValues(allSeasons, "Label");

  const totalPages = Math.ceil(farmerData?.length / itemsPerPage);

  const paginatedfarmers = filterdFarmers?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const getStationName = (_kf_Station) => {
    const station = allStation?.find(
      (station) => station.__kp_Station === _kf_Station
    );
    return station ? station.Name : null;
  };

  const getTrees = (farmerId) => {
    const houseHold = houseHoldData?.find(
      (houseHold) => houseHold.farmerid === farmerId
    );
    return houseHold ? houseHold.Trees : null;
  };

  const getGroupID = (_kf_Group) => {
    const group = groupData?.find((group) => group.__kp_Group === _kf_Group);
    return group ? group.ID_GROUP : null;
  };
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
  };
  const handleSearch = (e) => {
    const searchItem = e.target.value;
    setSearchQuery(searchItem);
  };

  const handleDownload = () => {
    const table = document.querySelector(".table-fixed");
    const rows = table.querySelectorAll("tr");

    const data = [];

    const headers = Array.from(rows[0].querySelectorAll("th")).map(
      (header) => header.innerText
    );
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
    link.setAttribute("download", "GeneralHarvest.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const calculateTotalKilogramsByFarmer = () => {
    const sumByFarmer = {};
  
    // Iterate through transactions
    transactionData?.forEach((transaction) => {
      let farmerId = transaction.farmerid;
      const farmerName = transaction.farmername;
      const kilograms = transaction.kilograms || 0;

      // Check if farmerId is empty, then find the farmerId based on name
      // if (!farmerId) {
      //   const matchingFarmer = farmerData?.find((farmer) =>
      //     farmer.Name.toLowerCase() === farmerName.toLowerCase()
          
      //   );
      //   if (matchingFarmer) {
      //     farmerId = matchingFarmer.farmerid;
      //   }
      //   // console.log("fff",farmerId)

      // }
  
      // Check if the farmerId exists in the sumMap
      if (!sumByFarmer[farmerId]) {
        sumByFarmer[farmerId] = 0;
      }
  
      // Add kilograms to the sumMap
      sumByFarmer[farmerId] += kilograms;
    });
  
    return sumByFarmer;
  };
const sumByFarmer = calculateTotalKilogramsByFarmer()  

  const totalFloaters = () => {
    const floatersByFarmer = {};

    // Iterate through transactions
    transactionData?.forEach((transaction) => {
      const farmerId = transaction.farmerid;
      const farmerName = transaction.farmername;
      const floaters = transaction.bad_kilograms || 0;

      // Check if the JOURNAL# exists in the sumMap
      if (!floatersByFarmer[farmerId]) {
        floatersByFarmer[farmerId] = 0;
      }

      // Add kilograms to the sumMap
      floatersByFarmer[farmerId] += floaters;
    });

    return floatersByFarmer;
  };

  const floatersByFarmer = totalFloaters();

  if (loading) {
    return <p>...Loading... </p>;
  }

  return (
    <div className="flex flex-col col-span-full xl:col-span-12">
      <div className="py-4 ml-0 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
        <div className="items-center  justify-between block sm:flex md:divide-x md:divide-gray-100 dark:divide-gray-700">
          <div className="flex items-center ml-10 mb-4 sm:mb-0">
            <div>
              <span className="flex just ml-2">Record</span>
              <select
                name=""
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="rounded-lg w-40 ml-1"
              >
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="400">400</option>
                <option value="500">500</option>
              </select>
            </div>

            <form className="sm:pr-3" action="#" method="GET">
              <label htmlFor="products-search" className="sr-only">
                Search
              </label>
              <div className="relative w-48 ml-3 mt-1 sm:w-64 mr-1 xl:w-96">
                <span>Search by Farmer Id, Name ...</span>
                <input
                  type="text"
                  name="email"
                  onChange={handleSearch}
                  id="products-search"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-[65%] p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Search by Farmer Id, Name ..."
                />
              </div>
            </form>
            {/* <div className="flex items-center sm:justify-end"> */}
            <div className="flex space-x-4 mt-1 -ml-32">
            <div>
                <p>Station</p>
                <select
                  name=""
                  value={selectedStation}
                  onChange={handleStationChange}
                  className="rounded-lg w-40"
                >
                  {/* <option value="all">All</option> */}
                  <option value="all">All</option>
                    {filteredStation.map((station) => (
                      <option key={station.__kp_Station} value={station.__kp_Station}>
                        {station.Name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <p>Season</p>
                <select
                  name=""
                  value={selectedSeason}
                  onChange={handleSeasonChange}
                  className="rounded-lg w-40"
                >
                  {/* <option value="all">All</option> */}
                  <option value="all">All</option>
                    {filteredSeasons.map((season) => (
                      <option key={season.__kp_Season} value={season.__kp_Season}>
                        {season.Label}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            {/* </div> */}

            <div className="ml-4">
              <button
                className="bg-green-500 text-white p-2 rounded-md mt-5"
                onClick={handleDownload}
              >
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row left-4 items-center justify-center py-8 gap-3"></div>

      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="p-4">
                      NO
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      FARMER-ID
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      NAMES
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      TREES
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      STATION
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      GROUP-ID
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      GOOD-PRODN
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      BAD-PRODN
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      SEASON
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {paginatedfarmers?.map((farmers, index) => (
                    <tr
                      key={farmers.id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>

                      <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                        {farmers.farmerid}
                      </td>
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {farmers.Name}
                      </td>

                      <td class="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">
                        {getTrees(farmers.farmerid)?.toLocaleString()}
                      </td>
                      <td class="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {getStationName(farmers._kf_Station)}
                      </td>
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {getGroupID(farmers._kf_Group)}
                      </td>
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {sumByFarmer[farmers.farmerid]?.toLocaleString()}
                      </td>
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {floatersByFarmer[farmers.farmerid]?.toLocaleString()}
                      </td>
                      <td className="p-4 text-base font-medium text-gray-500 whitespace-nowrap dark:text-white">
                        {season}
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
              {Math.min(currentPage * itemsPerPage, farmerData?.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {farmerData?.length}
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

export default GeneralHarvestTable;
