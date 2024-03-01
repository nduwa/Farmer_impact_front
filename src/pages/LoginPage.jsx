import React, { useEffect, useState } from "react";
import logo_IMG from "../images/logo.jpg";
import banner_IMG from "../images/banner_login.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from '../redux/actions/auth/login.action';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { user, loading } = useSelector((state) => state.login || {});

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ userName, password })).then((res) => {
      if (res.token) {
        navigate("/dashboard");
      }
      console.log(res);
    });
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);
  return (
    <div className="flex flex-col item lg:flex-row justify-center bg-white_variant lg:justify-between h-screen">
      <div className="flex flex-col w-full lg:w-auto items-center lg:py-8">
        <div className="w-full">
          <div className="w-full flex flex-col items-center lg:items-start p-6 lg:space-y-10 lg:ml-24 sm:p-8 rounded-lg dark:bg-gray-800">
            <div className="flex">
              <Link
                href="#"
                className="flex items-center justify-start mb-8 text-2xl font-semibold lg:mb-6 dark:text-white"
              >
                <img
                  src={logo_IMG}
                  className="mr-4 h-48 lg:h-14"
                  alt="RTC Logo"
                />
                <span className="hidden lg:flex text-gray-900 font-bold">
                  Rwanda Trading Company
                </span>
              </Link>
            </div>
            <h2 className="hidden md:flex text-left text-4xl font-bold text-gray-900 dark:text-white">
              Sign in to platform
            </h2>
            <h2 className="flex md:hidden text-left text-4xl font-bold text-gray-900 dark:text-white">
              Sign in
            </h2>
            <form
              className="mt-8 space-y-6 w-full md:w-11/12"
              onSubmit={handleLogin}
            >
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                >
                  Your username
                </label>
                <input
                  type="text"
                  onChange={(event) => setUserName(event.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-secondary_variant focus:border-secondary_variant block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="e.g johndoe"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                >
                  Your password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-secondary_variant focus:border-secondary_variant block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>
              <div className="flex">
                <Link
                  href="#"
                  className="text-sm text-secondary hover:underline dark:text-primary-500"
                >
                  Forgot Password?
                </Link>
              </div>
              <button
                type="submit"
                className="w-full px-5 py-3 text-base font-medium text-center text-white bg-secondary rounded-lg hover:bg-secondary_variant focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Login to your account
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex flex-col w-fit">
        <img
          src={banner_IMG}
          alt="banner"
          className="object-cover object-center h-full"
        />
        <ToastContainer />
      </div>
    </div>
  );
}
