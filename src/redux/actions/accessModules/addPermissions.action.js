
import { toast } from 'react-toastify';
import { permissionsFail, permissionsPending, permissionsSuccess } from "../../slices/accessModules/addPermissionsSlice";
import { addPermissions } from "../../../api/accessModulesApi";

export const assignPermission= (data) => async (dispatch) => {
    try {
      dispatch(permissionsPending());
    

      const res = await addPermissions(data);
      console.log("res",res)
      dispatch(permissionsSuccess(res));
      toast.success(res.message);
      return res;
    } catch (error) {
      if (error) {
      console.log("err",error)

        toast.error(`${error.message} `);
        return dispatch(permissionsFail(error.message));
      }
      toast.error(`${error.Error}`);
      console.log("errrr",error)

      return dispatch(permissionsFail(error.Error));
    }
  };