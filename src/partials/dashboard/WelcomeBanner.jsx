import React , {useEffect,useState} from 'react';
import {login} from '../../redux/actions/AuthAction'
import { useDispatch, useSelector } from "react-redux";
import { handleToken } from '../../redux/actions/fetchTokenAction';
import { useLocation } from 'react-router-dom';
import { useParams } from "react-router-dom";


function WelcomeBanner() {

  const { token, decodedToken } = useSelector((state) => state.fetchToken);
  const [currentPage, setCurrentPage] = useState('dashboard');
const userId = useParams()
const journalId = useParams()


const dispatch = useDispatch()
const location = useLocation();
useEffect(() => {
  dispatch(handleToken());
}, [dispatch]);
const user = decodedToken?.user.Name_Full

useEffect(() => {
  // Extract the page name from the current location
  const path = location.pathname;
  const pageName = path.substring(1); // Remove the leading slash

  // Update the current page based on the route
  setCurrentPage(pageName || 'dashboard'); // If the pageName is empty, set it to 'dashboard'
}, [location]);
  return (
    <div className="relative bg-indigo-200 dark:bg-indigo-500 p-4 sm:p-6 rounded-sm overflow-hidden mb-8">
      {/* Background illustration */}
      <div className="absolute right-0 top-0 -mt-4 mr-16 pointer-events-none hidden xl:block" aria-hidden="true">
        <svg width="319" height="198" xmlnsXlink="http://www.w3.org/1999/xlink">
          <defs>
            <path id="welcome-a" d="M64 0l64 128-64-20-64 20z" />
            <path id="welcome-e" d="M40 0l40 80-40-12.5L0 80z" />
            <path id="welcome-g" d="M40 0l40 80-40-12.5L0 80z" />
            <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="welcome-b">
              <stop stopColor="#A5B4FC" offset="0%" />
              <stop stopColor="#818CF8" offset="100%" />
            </linearGradient>
            <linearGradient x1="50%" y1="24.537%" x2="50%" y2="100%" id="welcome-c">
              <stop stopColor="#4338CA" offset="0%" />
              <stop stopColor="#6366F1" stopOpacity="0" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="none" fillRule="evenodd">
            <g transform="rotate(64 36.592 105.604)">
              <mask id="welcome-d" fill="#fff">
                <use xlinkHref="#welcome-a" />
              </mask>
              <use fill="url(#welcome-b)" xlinkHref="#welcome-a" />
              <path fill="url(#welcome-c)" mask="url(#welcome-d)" d="M64-24h80v152H64z" />
            </g>
            <g transform="rotate(-51 91.324 -105.372)">
              <mask id="welcome-f" fill="#fff">
                <use xlinkHref="#welcome-e" />
              </mask>
              <use fill="url(#welcome-b)" xlinkHref="#welcome-e" />
              <path fill="url(#welcome-c)" mask="url(#welcome-f)" d="M40.333-15.147h50v95h-50z" />
            </g>
            <g transform="rotate(44 61.546 392.623)">
              <mask id="welcome-h" fill="#fff">
                <use xlinkHref="#welcome-g" />
              </mask>
              <use fill="url(#welcome-b)" xlinkHref="#welcome-g" />
              <path fill="url(#welcome-c)" mask="url(#welcome-h)" d="M40.333-15.147h50v95h-50z" />
            </g>
          </g>
        </svg>
      </div>

      {/* Content */}
      <div className="relative">
        <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-1">Hello {user}👋</h1>
        <p className="dark:text-indigo-200">
          {currentPage === 'dashboard'
            ? 'Kigali Management: Inventory Dashboard'
            : currentPage === 'user_supply_inventory_details'
            ? 'User Supply Inventory Details'
            : currentPage === 'user_transactions'
            ? 'Coffee Purchases Site collector Daily journal'
            : currentPage === 'user-administaration/access-controll/module-access/:userId'
            ? 'Administration Module Access'
            : currentPage === `user-administaration/access-controll/mobile-access/:${userId}`
            ? 'Administration Mobile Access'
            : currentPage === 'user_transaction/cws-daily-journals'
            ? 'CWS Daily Journals'
            : currentPage === `user_transactions/staff_lot_details/:journalId`
            ? 'Coffee Purchases Site collector details'

            : currentPage === 'user-administration'
            ? 'Manage application Users'
            : 'Welcome to Farmer Impact System'}
        </p>
      </div>
    </div>
  );
}

export default WelcomeBanner;
