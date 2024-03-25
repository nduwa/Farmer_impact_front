import React from "react";
import { Link } from "react-router-dom";
import LineChart from "../../charts/LineChart01";
import Icon from "../../images/icon-02.svg";
import EditMenu from "../../components/DropdownEditMenu";

// Import utilities
import { tailwindConfig, hexToRGB } from "../../utils/Utils";

function FarmerPriceCard({ goodCherry,floaters}) {
  return (
    <div className="flex flex-col col-span-full h-full  sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <div className="px-5 pt-5">
        <div>
          <div className="flex flex-row justify-between text-[12px] mb-4">
            <label className="">CURRENT PURCHASE PRICE FROM THE FARMER</label>
          </div>
          <hr></hr>

          <div className="">
            <div className="flex flex-row justify-between text-[12px] mt-4 mb-2">
            <label className="">Good Cherry : </label>
            <label>{goodCherry} FRW</label>
            </div>
            <div className="flex flex-row justify-between text-[12px] mt-4 mb-2">
            <label className="">Floaters: </label>
            <label>{floaters} FRW</label>
            </div>
           
          </div>
        </div>
      </div>
      {/* Chart built with Chart.js 3 */}
    </div>
  );
}

export default FarmerPriceCard;