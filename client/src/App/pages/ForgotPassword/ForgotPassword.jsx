import React, { useState } from "react";
import "../Login/Login.scss";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import FormInputs from "../../Components/FormInputs/FormInputs";
import Buttons from "../../Components/Buttons/Buttons";
import { ADMIN_FORGOT_PASSWORD } from "../../utils/apiPath";
import { postApi } from "../../utils/apiService";
import { errorToast, successToast } from "../../services/ToastHelper";

const initialValues = {
  email: "",
};

const ForgotPassword = () => {
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

    setErrors((prev) => ({ ...prev, ...errObj }));
    const data = Object.values(errObj).every((x) => x === "" || x === null);
    return data;
  };

  const handleVerifyEmail = async () => {
    if (validateFields()) {
      setIsLoading(true);
      const { statusCode, message, error } = await postApi(ADMIN_FORGOT_PASSWORD, {} ,{
        params: { email: login.email }
      });
      if (statusCode === 200) {
        setIsLoading(false);
        successToast(message);
        navigate("/reset-password")
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
            <h3>Email For Verification</h3>
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
                    handleVerifyEmail();
                  }
                }}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
          </div>
          <div className="login_cont_section_buttons">
            <Buttons variant="primary" onClick={handleVerifyEmail}>
              Verify Email
            </Buttons>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
