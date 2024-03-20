import { fetchPending, fetchFail, fetchSuccess } from "../../slices/station/allStationsSlice";
import { allStations } from "../../../api/stationApi";
export const fetchAllStation = () => async (dispatch) => {
    try {
     
      dispatch(fetchPending());
      const res = await allStations();
      
      dispatch(fetchSuccess(res));
      toast.success(res.message);
      return res;
    } catch (error) {
      if (error) {
        toast.error(`${error.message} `);
        return dispatch(fetchFail(error.message));
      }
      toast.error(`${error.Error}`);
      return dispatch(fetchFail(error.Error));
    }
  };