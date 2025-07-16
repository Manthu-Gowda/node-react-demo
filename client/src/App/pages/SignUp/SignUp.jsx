import React, { useState } from "react";
import "../Login/Login.scss";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { errorToast, successToast } from "../../services/ToastHelper";
import FormInputs from "../../Components/FormInputs/FormInputs";
import Buttons from "../../Components/Buttons/Buttons";
import { ADMIN_LOGIN_DETAILS } from "../../utils/apiPath";
import { postApi } from "../../utils/apiService";

const initialValues = {
  userName: "",
  email: "",
  password: "",
};

const SignUp = () => {
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

    if (!login.userName) {
      errObj.userName = "This field is required";
    } else {
      errObj.userName = "";
    }

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

  
  const handleSignUp = async () => {
    if (validateFields()) {
      setIsLoading(true);

      const payload = {
        userName: login.userName,
        email: login.email,
        password: login.password,
        isActive: true,
      };

      const { status, message, error } = await postApi(
        "/account/createUser",
        payload
      );

      if (status === 200) {
        setIsLoading(false);
        successToast(message);
        navigate("/");
        setLogin(initialValues);
      } else {
        setIsLoading(false);
        errorToast(error);
      }
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
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
            <h3>Sign Up</h3>
          </div>
          <div className="login_cont_section_inputs">
            <div className="login_cont_section_inputs_data">
              <FormInputs
                title={"Name"}
                type={"text"}
                placeholder={"Enter Your Name"}
                name="userName"
                icon="icon1"
                value={login.userName}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSignUp();
                  }
                }}
              />
              {errors.userName && (
                <span className="error">{errors.userName}</span>
              )}
            </div>
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
                    handleSignUp();
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
                    handleSignUp();
                  }
                }}
              />
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>
          </div>
          {/* <div
            className="login_cont_section_forgot"
            onClick={handleForgotPassword}
          >
            <p>Forgot Password?</p>
          </div> */}
          <div className="login_cont_section_buttons">
            <Buttons variant="primary" onClick={handleSignUp}>
              Sign Up
            </Buttons>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
