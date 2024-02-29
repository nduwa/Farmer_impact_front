import React, { useState, useEffect } from "react";
import { AiTwotoneCloseCircle } from "react-icons/ai";
import { updateExistingUser } from "../redux/actions/updateUserAction";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditTransactionModel({
  transaction,
  onClose,
  onSubmit,
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const { upUser } = useSelector((state) => state.updateUser);
const [transactions, setTransactions] = useState()
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // const handlePasswordSubmit = async (e) => {
  //   if (password === confirmPassword) {
  //     try {
  //       dispatch(updateExistingUser(user.id, { password }));
  //       toast.success("user updated successfully");

  //       setPassword("");
  //       setConfirmPassword("");
  //       onClose();
  //       onSubmit(password, confirmPassword);
  //     } catch (error) {
  //       // Handle any errors if needed
  //       console.error("Update failed:", error);
  //       toast.error("Failed to update user");
  //     }
  //   } else {
  //     toast.error("Passwords don't match");
  //   }
  // };


  const calculateTotalPrice = () => {
    let totalPriceByTransaction;

    
      // const transactionId = transaction.id;
      const cash = transaction.cash_paid || 0;

      if (!totalPriceByTransaction) {
        totalPriceByTransaction = 0;
      }

      totalPriceByTransaction += cash;
    

    return totalPriceByTransaction;
  };

  const totalPriceByTransaction = calculateTotalPrice();

  return (
    <div className="fixed inset-0  flex items-center justify-center py-96  overflow-y-auto z-50">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black opacity-5"></div>

      {/* Modal */}
      <div className="bg-white  rounded-lg text-left   shadow-l transform transition-all sm:max-w-lg sm:w-full relative z-10 ">
        <div className="flex justify-end ">
          <button onClick={onClose}>
            <AiTwotoneCloseCircle />
          </button>
        </div>
        {/* Modal content */}
        {/* <div className="bg-white p-4 flex flex-col  "> */}
          {/* Display fields from API for the selected user */}
          <div className=" px-16 space-y-4  " >
          <p className="">Edit Transaction</p>
          <hr className="mb-4 border border-gray-200 " />
          <input
            className="rounded-lg   w-80"
            type="text"
            value={transaction.lotnumber}
            // readOnly
          />
          <br />

          <input
              className="rounded-lg   w-80"
            type="text"
            value={transaction.paper_receipt}
            // readOnly
          />
          <br />
          <input
             className="rounded-lg   w-80"
            type="text"
            value={transaction.transaction_date}
            // readOnly
          />
          <br />
          {/* Input fields for password */}
          <input
            type="text"
            value=     {transaction.certified === 1
              ? transaction.kilograms
              : 0}
            // onChange={handlePasswordChange}
            placeholder="password"
            className="rounded-lg   w-80"
          />
          <br />
          
          <input
            type="text"
            value={transaction.certified === 1 ? 0 : transaction.kilograms}
            // onChange={handleConfirmPasswordChange}
            placeholder="confirm password"
            className="rounded-lg w-80"
          />
          <br />
       
          
          <input
            className="rounded-lg w-80"
            type="text"
            value={transaction.unitprice}
            // readOnly
          />
          <br />
          <input
            className="rounded-lg w-80"
            type="text"
            value= {totalPriceByTransaction.toLocaleString()}
            // readOnly
          />
          <br />
          <input
            type="text"
            value={transaction.bad_kilograms}
            // onChange={handleConfirmPasswordChange}
            placeholder="confirm password"
            className="rounded-lg w-80"
          />

          <br />
          <input
            type="text"
            value={transaction.bad_unit_price}
            // onChange={handleConfirmPasswordChange}
            placeholder="confirm password"
            className="rounded-lg w-80"
          />
          <br/>
           <input
            type="text"
            value={transaction.certification=== "CP" ? "Cafe Practice" : transaction.certification=== "RN"? "Rain Forest" : transaction.certification === "NC" ? "Non Certified":""}

            
            // onChange={handleConfirmPasswordChange}
            placeholder="confirm password"
            className="rounded-lg w-80"
          />
         
          

          <br />

          <ToastContainer />

          {/* Button to submit password */}
          <button
            className="bg-green-400 w-48 h-10 flex items-center justify-center rounded-lg"
            // onClick={handlePasswordSubmit}
          >
            Edit User Account
          </button>
          </div>
         
        </div>
      {/* </div> */}
    </div>
  );
}
