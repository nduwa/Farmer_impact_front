import React from "react";
import Login from "../images/login_banner.jpg";
import { NavLink } from "react-router-dom";

export default function LoginPage() {
  return (
    <div>
      <div className="contact-cont">
        <div className="p-infor">
          <img src={Login} alt="Icon 01" />
          <div className="emp-info">
            <form action="">
              <input type="text" placeholder="User Name" />
              <input type="password" placeholder="Password" />
              <NavLink
                              end
                              to="/dashboard"
                            //   className="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                            >
              <button>LOGIN</button>
              </NavLink>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
