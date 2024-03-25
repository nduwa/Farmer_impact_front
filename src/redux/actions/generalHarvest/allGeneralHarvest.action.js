import {
  commissionSuccess,
  commissionFail,
  commissionPending,
} from "../../slices/transactions/addCommissionFees";
import { addCommissionFees } from "../../../api/coffeePurchaseApi";
import { toast } from "react-toastify";
import {
  generalHarvestFail,
  generalHarvestPending,
  generalHarvestSuccess,
} from "../../slices/generalHarvest/allGeneralHarvestSlice";
import { getAllGeneralHarvest } from "../../../api/generalHarvestApi";

export const fetchGeneralHarvests = (data) => async (dispatch) => {
  try {
    dispatch(generalHarvestPending());

    const res = await getAllGeneralHarvest(data);

    dispatch(generalHarvestSuccess(res));
    toast.success(res.message);
    return res;
  } catch (error) {
    if (error) {
      console.log("err", error);

      toast.error(`${error.message} `);
      console.log("errrrr", error.message);
      return dispatch(generalHarvestFail(error.message));
    }
    toast.error(`${error.Error}`);
    console.log("errrr", error);
    return dispatch(generalHarvestFail(error.Error));
  }
};
