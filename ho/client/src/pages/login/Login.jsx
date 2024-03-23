import React, { useState, useContext } from "react";
import axios from "axios";
import { GoogleLogin } from "react-google-login";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/auth/login", credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      navigate("/");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  const handleGoogleSuccess = async (googleData) => {
    console.log("Google authentication successful:", googleData);
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/auth/google-login", { tokenId: googleData.tokenId });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      navigate("/");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google authentication failed:", error);
    dispatch({ type: "LOGIN_FAILURE", payload: error.message });
  };

  return (
    <div className="login">
      <div className="lContainer">
        <input
          type="email"
          placeholder="Email"
          id="email"
          value={credentials.email}
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={credentials.password}
          onChange={handleChange}
          className="lInput"
        />
        <button disabled={loading} onClick={handleEmailLogin} className="lButton">
          {loading ? 'Logging in...' : 'Login with Email'}
        </button>
        
        {error && <span>{error.message}</span>}

        <GoogleLogin
          clientId="450627382054-pkcrn0akt03q680ec0vamlb6752ua691.apps.googleusercontent.com"
          buttonText="Login with Google"
          onSuccess={handleGoogleSuccess}
          onFailure={handleGoogleFailure}
          cookiePolicy={'single_host_origin'}
          className="google-button"
        />
      </div>
    </div>
  );
};

export default Login;
