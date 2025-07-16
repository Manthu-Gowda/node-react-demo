import React, { useState } from "react";
import "../Login/Login.scss";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { errorToast, successToast } from "../../services/ToastHelper";
import FormInputs from "../../Components/FormInputs/FormInputs";
import Buttons from "../../Components/Buttons/Buttons";
import { Flex, Input } from "antd";
import { ADMIN_RESET_PASSWORD } from "../../utils/apiPath";
import { postApi } from "../../utils/apiService";

const initialValues = {
  otp: "",
  password: "",
};

const ResetPassword = () => {
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

  const handleOtpChange = (otp) => {
    const numericOtp = otp.replace(/\D/g, "");
    setLogin({
      ...login,
      otp: numericOtp,
    });
    setErrors({
      ...errors,
      otp: "",
    });
  };

  const validateFields = () => {
    let errObj = { ...initialValues };

    if (!login.password) {
      errObj.password = "This field is required";
    } else if (login.password.length < 8) {
      errObj.password = "Password must be 8 characters";
    } else {
      errObj.password = "";
    }

    setErrors((prev) => ({ ...prev, ...errObj }));
    const data = Object.values(errObj).every((x) => x === "" || x === null);
    return data;
  };

  const handleResetPassword = async () => {
    if (validateFields()) {
      setIsLoading(true);
      const payload = {
        otp: login.otp,
        newPassword: login.password,
      };
      const { statusCode, message, error } = await postApi(
        ADMIN_RESET_PASSWORD,
        payload
      );
      if (statusCode === 200) {
        setIsLoading(false);
        navigate("/");
        successToast(message);
      } else {
        errorToast(error);
        setIsLoading(false);
      }
    }
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
            <h3>Create New Password</h3>
          </div>
          <div className="login_cont_section_inputs">
            <div className="login_cont_section_inputs_data">
              <label>Enter OTP</label>
              <Flex gap="middle" align="flex-center" vertical>
                <Input.OTP length={4} onChange={handleOtpChange} size="large" />
              </Flex>
            </div>
            <div className="login_cont_section_inputs_data">
              <FormInputs
                title={"Set New Password"}
                type={"password"}
                placeholder={"********"}
                name="password"
                icon="icon2"
                value={login.password}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleResetPassword();
                  }
                }}
              />
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>
            {/* <div className="login_cont_section_inputs_data">
              <FormInputs
                title={"Confirm Password"}
                type={"password"}
                placeholder={"********"}
                name="confirmPassword"
                icon="icon2"
                value={login.confirmPassword}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleResetPassword();
                  }
                }}
              />
              {errors.confirmPassword && (
                <span className="error">{errors.confirmPassword}</span>
              )}
            </div> */}
          </div>
          <div className="login_cont_section_buttons">
            <Buttons variant="primary" onClick={handleResetPassword}>
              Change Password
            </Buttons>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
