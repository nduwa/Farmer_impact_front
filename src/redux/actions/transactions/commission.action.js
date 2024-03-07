import { toast } from 'react-toastify';
import { commissionPending, commissionSuccess, commissionFail } from '../../slices/transactions/commission';

export const addCommission= (data) => async (dispatch) => {
    try {
      dispatch(commissionPending());
     
      dispatch(commissionSuccess(data));
    //   toast.success(res.message);
     
    } catch (error) {
      if (error) {
      console.log("err",error)

        // toast.error(`${error.message} `);
        return dispatch(commissionFail(error.message));
      }
    //   toast.error(`${error.Error}`);
      console.log("errrr",error)

      return dispatch(commissionFail(error.Error));
    }
  };

    

