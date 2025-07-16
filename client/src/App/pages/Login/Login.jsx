import React, { useState } from "react";
import "./Login.scss";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { errorToast, successToast } from "../../services/ToastHelper";
import FormInputs from "../../Components/FormInputs/FormInputs";
import Buttons from "../../Components/Buttons/Buttons";
import { postApi } from "../../utils/apiService";

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLogin({
      ...login,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateFields = () => {
    let errObj = { ...initialValues };

    if (!login.email) {
      errObj.email = "This field is required";
    } else if (!/\S+@\S+\.\S+/.test(login.email)) {
      errObj.email = "Enter Valid Email Id";
    } else {
      errObj.email = "";
    }

    if (!login.password) {
      errObj.password = "This field is required";
    } else if (login.password.length < 8) {
      errObj.password = "Password must be at least 8 characters";
    } else {
      errObj.password = "";
    }

    setErrors((prev) => ({ ...prev, ...errObj }));
    const data = Object.values(errObj).every((x) => x === "" || x === null);
    return data;
  };

  const handleLogin = async () => {
    if (validateFields()) {
      setIsLoading(true);
      const payload = {
        email: login.email,
        password: login.password,
      };
      const { status, data, message, error } = await postApi(
        "/account/userLogin",
        payload
      );
      if (status === 200) {
        localStorage.setItem("accessToken", data.token);
        setIsLoading(false);
        successToast(message);
        navigate("/add");
      } else {
        setIsLoading(false);
        errorToast(error);
      }
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="login">
      {isLoading && (
        <div className="loader-container">
          <div className="loader">
            <Oval
              color="#86d3ff"
              height={50}
              width={50}
              radius="7"
              secondaryColor="#86d3ff"
            />
          </div>
        </div>
      )}
      <div className="login_cont">
        <div className="login_cont_section">
          <div className="login_cont_section_header">
            <h3>Login</h3>
          </div>
          <div className="login_cont_section_inputs">
            <div className="login_cont_section_inputs_data">
              <FormInputs
                title={"Email"}
                type={"text"}
                placeholder={"Enter Your Email"}
                name="email"
                icon="icon1"
                value={login.email}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="login_cont_section_inputs_data">
              <FormInputs
                title={"Password"}
                type={"password"}
                placeholder={"********"}
                name="password"
                icon="icon2"
                value={login.password}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
              />
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>
          </div>
          <div
            className="login_cont_section_forgot"
            onClick={handleForgotPassword}
          >
            <p>Forgot Password?</p>
          </div>
          <div className="login_cont_section_buttons">
            <Buttons variant="primary" onClick={handleLogin}>
              Login
            </Buttons>
          </div>
          <div className="login_cont_section_bottom">
              <span onClick={handleSignUp}>Don't have and account? <strong>Sign Up</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
