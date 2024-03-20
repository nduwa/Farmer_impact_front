
import { Link } from 'react-router-dom';
import LineChart from '../../charts/LineChart01';
import Icon from '../../images/icon-02.svg';
import EditMenu from '../../components/DropdownEditMenu';
import { tailwindConfig, hexToRGB } from '../../utils/Utils';
import React, { useState, useEffect } from "react";


import "react-toastify/dist/ReactToastify.css";




function CherryPurchasedCard( { cardTitle,totalCherryPurchases,  certified, traceableUncertified, uncertifiedUntraceable, floaters}) {

 





  return (
    <div className="flex flex-col  col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          {/* Icon */}
          <img src={Icon} width="32" height="32" alt="Icon 02" />
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
            <label className=''>{cardTitle} (KG)</label>
            <label>1{totalCherryPurchases} KG</label>
          
          </div>
          <hr></hr>
        <div>
        <div className='flex flex-row justify-between text-[12px] mt-4 mb-2'>
            <label className=''>Certified</label>
            <label>{certified} Kg</label>
          </div>
          <div className='flex flex-row justify-between text-[12px] mb-2'>
            <label className=''>Traceable unCertified</label>
            <label>{traceableUncertified} Kg</label>
          </div>
          <div className='flex flex-row justify-between text-[12px] mb-2'>
            <label className=''>Uncertified Untraceable</label>
            <label>{uncertifiedUntraceable} Kg</label>
          </div>
          <div className='flex flex-row justify-between text-[12px] mb-2'>
            <label className=''>Floaters</label>
            <label>{floaters} Kg</label>
          </div>
        </div>
        </div>
          
       
      </div>
      {/* Chart built with Chart.js 3 */}
  
    </div>
  );
}

export default CherryPurchasedCard;
