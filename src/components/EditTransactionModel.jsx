import React, { useState, useEffect } from "react";
import { AiTwotoneCloseCircle } from "react-icons/ai";
import { updateTransaction } from "../redux/actions/transactions/updateTransaction.action";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { fetchAllTransactionsByJournal } from "../redux/actions/transactions/transactionsByJournal.action";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";


const token = localStorage.getItem("token")
export default function EditTransactionModel({
  transaction,
  onClose,
  onSubmit,
}) {

  const dispatch = useDispatch();
  const journalId = useParams();
  const [editedTransaction, setEditedTransaction] = useState({
    lotnumber: transaction.lotnumber,
    paper_receipt: transaction.paper_receipt,
    transaction_date: transaction.transaction_date,
    certifiedKG: transaction.certified === 1 ? transaction.kilograms : 0,
    uncertifiedKG: transaction.certified === 1 ? 0 : transaction.kilograms,
    unitprice: transaction.unitprice,
    bad_kilograms: transaction.bad_kilograms,
    bad_unit_price: transaction.bad_unit_price,
    kilograms:transaction.kilograms,
    certificationType:
      transaction.certification === "CP"
        ? "Cafe Practice"
        : transaction.certification === "RN"
          ? "Rain Forest"
          : transaction.certification === "NC"
            ? "Non Certified"
            : "",
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTransaction((prevTransaction) => ({
      ...prevTransaction,
      [name]: value,
    }));
  };


 

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
       dispatch(updateTransaction(token, transaction.id, editedTransaction));
      toast.success("Transaction updated successfully");
      onClose();
      onSubmit(editedTransaction);
  
      // Fetch transactions after successful update
      dispatch(fetchAllTransactionsByJournal(token, journalId.journalId.replace(":", "")));
  
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update transaction");
    }
  };
  




  const calculateTotalPrice = () => {
    let totalPriceByTransaction;


    // const transactionId = transaction.id;
    const totalPrice = transaction.kilograms*transaction.unitprice + transaction.bad_kilograms*transaction.bad_unit_price || 0;

    if (!totalPriceByTransaction) {
      totalPriceByTransaction = 0;
    }

    totalPriceByTransaction= totalPrice;


    return totalPriceByTransaction;
  };

  const totalPriceByTransaction = calculateTotalPrice();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-5 overflow-y-auto flex items-center justify-center z-50">
      <div className="bg-white  rounded-lg shadow-md mt-auto">

        {/* Modal */}

        <div className="flex justify-end ">
          <button onClick={onClose}>
            <AiTwotoneCloseCircle />
          </button>
        </div>

        <div className=" px-16 space-y-3 mb-4" >
          <p className="text-green-500">Edit Transaction</p>
          <hr className="mb-4 border border-gray-200 " />
          <p>Lot Number</p>
          <input
            className="rounded-lg   w-80"
            type="text"
            value={editedTransaction.lotnumber}
            readOnly
          />

          <p>Paper Receipt</p>

          <input
            className="rounded-lg   w-80"
            type="text"
            value={editedTransaction.paper_receipt}
            readOnly
          />

          <p>Transaction Date</p>

          <input
            className="rounded-lg   w-80"
            type="text"
            value={editedTransaction.transaction_date}
            onChange={handleInputChange}
          />


          <p>kilograms</p>

          <input
            type="text"
            name="kilograms"
            value={editedTransaction.kilograms}
            onChange={handleInputChange}

            placeholder=""
            className="rounded-lg   w-80"
          />

          <p>Unit Price</p>

          <input
            className="rounded-lg w-80"
            type="text"
            name="unitprice"
            value={editedTransaction.unitprice}
            onChange={handleInputChange}
          
          />

          <p>Total Price</p>

          <input
            className="rounded-lg w-80"

            type="text"
            value={totalPriceByTransaction.toLocaleString()}
          // readOnly
          />

          <p>Floaters</p>

          <input
            type="text"
            name="bad_kilograms"
            value={editedTransaction.bad_kilograms}

            onChange={handleInputChange}

            placeholder=""
            className="rounded-lg w-80"
          />


          <p>Price Per Floater</p>

          <input
            type="text"
            name="bad_unit_price"
            value={editedTransaction.bad_unit_price}

            onChange={handleInputChange}

            placeholder=""
            className="rounded-lg w-80"
          />
          <p>Certification Type</p>

          <select
            name="certificationType"
            value={editedTransaction.certificationType}
            onChange={handleInputChange}
            className="rounded-lg w-80"
          >
            <option value="CP">Cafe Practice</option>
            <option value="RN">Rain Forest</option>
            <option value="NC">Non Certified</option>
          </select>





          <ToastContainer />

          {/* Button to submit password */}
          <button
            className="bg-green-400 w-48 h-10  flex items-center justify-center rounded-lg"
            onClick={handleEditSubmit}
          >
            Edit User Account
          </button>
        </div>

      </div>
    </div>

  );
}
