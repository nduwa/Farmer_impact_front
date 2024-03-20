import { toast } from "react-toastify";
import { getAllSeasons } from "../../../api/generalHarvestApi";
import {
  seasonsFail,
  seasonsPending,
  seasonsSuccess,
} from "../../slices/season/allSeasonSlice";

export const fetchAllSeasons = () => async (dispatch) => {
  try {
    dispatch(seasonsPending());

    const res = await getAllSeasons();
    console.log("res", res);
    dispatch(seasonsSuccess(res));
    toast.success(res.message);
    return res;
  } catch (error) {
    if (error) {
      console.log("err", error);

      toast.error(`${error.message} `);
      console.log("errrrr", error.message);
      return dispatch(seasonsFail(error.message));
    }
    toast.error(`${error.Error}`);
    console.log("errrr", error);
    return dispatch(seasonsFail(error.Error));
  }
};
