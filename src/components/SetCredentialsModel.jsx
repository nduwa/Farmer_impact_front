import React, { useState ,useEffect} from "react";
import { AiTwotoneCloseCircle } from "react-icons/ai";
import { updateExistingUser } from "../redux/actions/updateUserAction";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SetCredentialsModel({ user, onClose, onSubmit }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const { upUser } = useSelector((state) => state.updateUser);
 

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
  
  const handlePasswordSubmit = async (e) => {
    if (password === confirmPassword) {
      try {
       
        dispatch(updateExistingUser(user.id, { password }));
        toast.success('user updated successfully');
     
        setPassword('');
        setConfirmPassword('');
        onClose();
        onSubmit(password, confirmPassword);
      } catch (error) {
        // Handle any errors if needed
        console.error('Update failed:', error);
        toast.error('Failed to update user');
      }
    } else {
      toast.error("Passwords don't match");
    }
  };
  
  

  return (
    <div className="fixed inset-0  flex items-center justify-center   z-50">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black opacity-5"></div>

      {/* Modal */}
      <div className="bg-white rounded-lg text-left overflow-hidden shadow-l transform transition-all sm:max-w-lg sm:w-full relative z-10">
        <div className="flex justify-end p-4">
          <button onClick={onClose}>
            <AiTwotoneCloseCircle />
          </button>
        </div>
        {/* Modal content */}
        <div className="bg-white p-4 flex flex-col ">
          {/* Display fields from API for the selected user */}
          <p className="  -mt-8 mb-2   ">Edit User Password</p>
          <hr className="mb-4 border border-gray-200" />
          <input
            className="rounded-lg"
            type="text"
            value={user.Name_Full}
            readOnly
          />
          <br />

          <input
            className="rounded-lg"
            type="text"
            value={user.Name_User}
            readOnly
          />
          <br />
          <input
            className="rounded-lg"
            type="text"
            value={user.Email}
            readOnly
          />
          <br />
          {/* Input fields for password */}
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="password"
            className="rounded-lg"
          />
          <br />
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="confirm password"
            className="rounded-lg"
          />
          <br />
          <ToastContainer/>

          {/* Button to submit password */}
          <button
            className="bg-green-400 w-48 h-10 flex items-center justify-center rounded-lg"
            onClick={handlePasswordSubmit}
          >
            Edit User Account
          </button>
        </div>
      </div>
    </div>
  );
}
