import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { PiUsersFourDuotone } from "react-icons/pi";
import { IoIosPhonePortrait } from "react-icons/io";
import { GrSystem } from "react-icons/gr";
import { getSingleUserById } from "../../redux/actions/singleUserAction";
import { getModules } from "../../redux/actions/accessModules/getAllModulesAction";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const AccessControlTable = () => {
  const userId = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [fetchedUser, setFetchedUser] = useState();
  const [retrievedModules, setRetrievedModules] = useState();
  const { user, loading } = useSelector((state) => state.fetchSingleUser);
  const { modules } = useSelector((state) => state.fetchAllModules);
 

  useEffect(() => {
    dispatch(getSingleUserById(userId.userId));
  }, [dispatch]);
  console.log("userId", userId.userId)
  useEffect(() => {
    if (user) {
      setFetchedUser(user?.data);
    }
  }, [user]);

  // console.log("fetcheddd", fetchedUser)

  useEffect(() => {
    dispatch(getModules());
  }, [dispatch]);
  // console.log("userId", user?.data.Name_Full)
  useEffect(() => {
    if (modules) {
      const platforms = modules.data.map((module) => module.platform);
      console.log("platforms", platforms);
      setRetrievedModules(modules.data);
      console.log("retttt", retrievedModules);
    }
  }, [user]);


  return (
    <div className="flex flex-col col-span-full xl:col-span-12">
      <div className="p-4 mb-5 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
        <p className="mb-6 ml-20">
          Dashboard access control for <b>{fetchedUser?.Name_Full}</b>
        </p>
        <div className="   items-center justify-between block sm:flex md:divide-x md:divide-gray-100 dark:divide-gray-700">
          <div className="flex items-center ml-20 mb-4 sm:mb-0 gap-24">
            <ul className="flex items-center gap-10">
              <li className="flex items-center gap-2">
                <PiUsersFourDuotone />
                <NavLink
                  end
                  to="/user-administration"
                  className="block text-slate-500 hover:text-slate-200 transition duration-150 truncate"
                >
                  <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                    List All Users
                  </span>
                </NavLink>
              </li>
              <li className="flex items-center gap-2">
                <IoIosPhonePortrait />
                <NavLink
                  end
                  to="/user-administaration/access-controll/mobile-access/:userId"
                  className="block text-slate-500 hover:text-slate-400 transition duration-150 truncate"
                >
                  <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                    Mobile Menus
                  </span>
                </NavLink>
              </li>
              <li className="flex items-center gap-2">
                <GrSystem />
                <NavLink
                  end
                  to="/user-administaration/access-controll/module-access/:userId"
                  className="block text-slate-500 hover:text-slate-400 transition duration-150 truncate"
                >
                  <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                    Web Console Modules
                  </span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
                <thead className="bg-gray-100 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="p-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-all"
                          aria-describedby="checkbox-1"
                          type="checkbox"
                          className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label htmlFor="checkbox-all" className="sr-only">
                          checkbox
                        </label>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      View
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Add
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Del
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {retrievedModules
                    ?.filter(
                      (module) =>
                        module.platform === "dashboard" && module.module_name
                    ) // Filter modules with "dashboard" platform and have module_name
                    .map((module, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                          {module.module_name}
                        </td>
                        <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <div className="flex items-center">
                            <input
                              id="checkbox-all"
                              aria-describedby="checkbox-1"
                              type="checkbox"
                              className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label htmlFor="checkbox-all" className="sr-only">
                              checkbox
                            </label>
                          </div>
                        </td>
                        <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <div className="flex items-center">
                            <input
                              id="checkbox-all"
                              aria-describedby="checkbox-1"
                              type="checkbox"
                              className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label htmlFor="checkbox-all" className="sr-only">
                              checkbox
                            </label>
                          </div>
                        </td>
                        <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <div className="flex items-center">
                            <input
                              id="checkbox-all"
                              aria-describedby="checkbox-1"
                              type="checkbox"
                              className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label htmlFor="checkbox-all" className="sr-only">
                              checkbox
                            </label>
                          </div>
                        </td>
                        <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <div className="flex items-center">
                            <input
                              id="checkbox-all"
                              aria-describedby="checkbox-1"
                              type="checkbox"
                              className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label htmlFor="checkbox-all" className="sr-only">
                              checkbox
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
                <button
                  className="bg-green-400 mt-4   w-48 h-10 flex items-center justify-center rounded-lg"
                  // onClick={handlePasswordSubmit}
                >
                  Save Access Control
                </button>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessControlTable;
