// import { addFail, addPending,addSuccess } from "../../slices/transactions/addCommisionPrice";
// import { addCommissionPrice } from "../../../api/coffeePurchaseApi";
// import { toast } from 'react-toastify';

// export const CommisionPrice= (token,data) => async (dispatch) => {
//     try {
//       dispatch(addPending());


//       const res = await addCommissionPrice(token,data);
//       console.log("res",res)
//       dispatch(addSuccess(res));
//       toast.success(res.message);
//       return res;
//     } catch (error) {
//       if (error) {
//       console.log("err",error)

//         toast.error(`${error.message} `);
//         return dispatch(addFail(error.message));
//       }
//       toast.error(`${error.Error}`);
//       console.log("errrr",error)

//       return dispatch(addFail(error.Error));
//     }
//   };