import React from 'react';
import { Link } from 'react-router-dom';
import LineChart from '../../charts/LineChart01';
import Icon from '../../images/icon-03.svg';
import EditMenu from '../../components/DropdownEditMenu';

// Import utilities
import { tailwindConfig, hexToRGB } from '../../utils/Utils';

function DashboardCard03() {



  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          {/* Icon */}
          <img src={Icon} width="32" height="32" alt="Icon 03" />
          {/* Menu button */}
          <EditMenu align="right" className="relative inline-flex">
            <li>
              <Link className="font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3" to="#0">
                Option 1
              </Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3" to="#0">
                Option 2
              </Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-rose-500 hover:text-rose-600 flex py-1 px-3" to="#0">
                Remove
              </Link>
            </li>
          </EditMenu>
        </header>
        <div>
          <div className='flex flex-row justify-between text-[12px] mb-4'>
            <label className=''>TOTAL CHERRY PURCHASES (KG)</label>
            <label>15,017,194KG</label>
          
          </div>
          <hr></hr>
        
          <div className='flex flex-row justify-between text-[12px] mt-4 mb-2'>
            <label className=''>Certified</label>
            <label>9,934,926 Kg</label>
          </div>
          <div className='flex flex-row justify-between text-[12px] mb-2'>
            <label className=''>Traceable unCertified</label>
            <label>9,934,926 Kg</label>
          </div>
          <div className='flex flex-row justify-between text-[12px] mb-2'>
            <label className=''>Uncertified Untraceable</label>
            <label>9,934,926 Kg</label>
          </div>
          <div className='flex flex-row justify-between text-[12px] mb-2'>
            <label className=''>Floaters</label>
            <label>9,934,926 Kg</label>
          </div>
        </div>
      </div>
      {/* Chart built with Chart.js 3 */}

    </div>
  );
}

export default DashboardCard03;
