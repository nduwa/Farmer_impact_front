import React, { useState, useEffect } from "react";
import { AiTwotoneCloseCircle } from "react-icons/ai";
import { addTransactionBucket } from "../redux/actions/transactions/transactionBucket.action";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
// import { fetchAllTransactionsByJournal } from "../redux/actions/transactions/transactionsByJournal.action";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";


const token = localStorage.getItem("token")

export default function BucketingModel({
  journal,
 
  onClose,
  onSubmit,
})
{

  const dispatch = useDispatch();
  const journalId = useParams();
  const [editedJournal, setEditedJournal] = useState({
   bucket_a:'',
    bucket_b: "",
    bucket_c: "",
    day_lot: journal.cherry_lot_id,
    certified:journal.certified,

  });
console.log("journall",editedJournal)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedJournal((prevJournal) => ({
      ...prevJournal,
      [name]: value,
    }));
  };


  // console.log("journal",journal)


  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
       dispatch(addTransactionBucket(token,editedJournal));
      toast.success("Transaction updated successfully");
      onClose();
      onSubmit(editedJournal);
  
      // Fetch transactions after successful update
      // dispatch(fetchAllTransactionsByJournal(token, journalId.journalId.replace(":", "")));
  
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update transaction");
    }
  };
  




 

  return (
    <div className="fixed inset-0 bg-black bg-opacity-5 overflow-y-auto flex items-center justify-center z-50">
      <div className="bg-white  rounded-lg shadow-md ">

        {/* Modal */}

        <div className="flex justify-end ">
          <button onClick={onClose}>
            <AiTwotoneCloseCircle />
          </button>
        </div>

        <div className=" px-16 space-y-3 mb-4" >
          <p className="text-green-500">BUCKETING INFO</p>
          <hr className="mb-4 border border-gray-200 " />
          <p>BUCKET A</p>
          <input
            className="rounded-lg   w-80"
            type="text"
            value={editedJournal.bucket_a}
            onChange={handleInputChange}
            name="bucket_a"

           
          />

          <p>BUCKET B</p>

          <input
            className="rounded-lg   w-80"
            type="text"
            value={editedJournal.bucket_b}
            onChange={handleInputChange}
            name="bucket_b"

            
          />

          <p>BUCKET C</p>

          <input
            className="rounded-lg   w-80"
            type="text"
            value={editedJournal.bucket_c}
            onChange={handleInputChange}
            name="bucket_c"
          />


         





          <ToastContainer />

          {/* Button to submit password */}
          <button
            className="bg-green-400 w-48 h-10  flex items-center justify-center rounded-lg"
            onClick={handleEditSubmit}
          >
            Save Bucket
          </button>
        </div>

      </div>
    </div>

  );
}
