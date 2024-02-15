import React from "react";
import Login from "../images/login_banner.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { login } from "../redux/actions/AuthAction";
import "react-toastify/dist/ReactToastify.css";
export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { user, loading } = useSelector((state) => state.login || {});

  console.log(userName);
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
    <div>
      <div className="contact-cont">
        <div className="p-infor">
          <img src={Login} alt="Icon 01" />
          <div className="emp-info">
            <form action="" onSubmit={handleLogin}>
              <input
                type="text"
                onChange={(event) => setUserName(event.target.value)}
                placeholder="User Name"
              />
              <input
                type="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
              />

              <button>LOGIN</button>
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
