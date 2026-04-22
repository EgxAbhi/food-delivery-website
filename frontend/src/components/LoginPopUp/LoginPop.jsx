import React, { useContext, useState, useEffect } from "react";
import "./LoginPop.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const LoginPop = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Sign Up");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    setData({
      name: "",
      email: "",
      password: "",
    });
    setCurrState("Sign Up");
  }, []);

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setData((data) => ({ ...data, [name]: value }));
  };

  const handleStateChange = (newState) => {
    setCurrState(newState);
    setData({
      name: "",
      email: "",
      password: "",
    });
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;

    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    try {
      const res = await axios.post(newUrl, data);

      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        setShowLogin(false);
      } else {
        alert(res.data.message || "Error");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Error in authentication");
    }
  };
  return (
    <div className="login-pop">
      <form onSubmit={onLogin} className="login-popC" autoComplete="off">
        <div className="login-popT">
          <h2>{currState}</h2>
          <img
            onClick={() => {
              setShowLogin(false);
              setData({
                name: "",
                email: "",
                password: "",
              });
              setCurrState("Sign Up");
            }}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-PopI">
          {currState === "Login" ? (
            <></>
          ) : (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your Name"
              required
              autoComplete="new-name"
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your Email"
            required
            autoComplete="new-email"
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            required
            autoComplete="new-password"
          />
        </div>
        <button type="submit">
          {currState === "Sign Up" ? "Create Account" : "Login"}
        </button>
        <div className="login-popCondition">
          <input type="checkbox" required />
          <p>By Continuing,i agree to the terms of use & privacy policy.</p>
        </div>
        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => handleStateChange("Sign Up")}>Click Here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => handleStateChange("Login")}>Click Here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPop;
