import React, { useEffect, useState } from "react";
import CoustomLayout from "../../Components/CoustomLayout/CoustomLayout";
import { DatePicker } from "antd";
import "./AddEmployees.scss";
import Buttons from "../../Components/Buttons/Buttons";
import { getApi, postApi } from "../../utils/apiService";
import { GET_EVENT_BY_ID } from "../../utils/apiPath";
import { errorToast, successToast } from "../../services/ToastHelper";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import FormInputs from "../../Components/FormInputs/FormInputs";

const initialvalues = {
  employeeName: "",
  email: "",
  // password: "",
  phoneNumber: "",
  dateOfBirth: "",
  address: "",
};

const AddEmployees = () => {
  const [userData, setUserData] = useState(initialvalues);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = state || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleDateChange = (date, dateString) => {
    setUserData({
      ...userData,
      dateOfBirth: dateString,
    });
    setErrors({
      ...errors,
      dateOfBirth: "",
    });
  };

  const validateFields = () => {
    let errObj = {};

    if (!userData.employeeName) {
      errObj.employeeName = "User Name is required";
    }
    if (!userData.email) {
      errObj.email = "Email is required";
    }
    // if (!userData.password) {
    //   errObj.password = "Password is required";
    // }
    if (!userData.phoneNumber) {
      errObj.phoneNumber = "Phone Number is required";
    }
    if (!userData.dateOfBirth) {
      errObj.dateOfBirth = "Date of Birth is required";
    }
    if (!userData.address) {
      errObj.address = "Address is required";
    }

    setErrors(errObj);
    return Object.keys(errObj).length === 0;
  };
  
  const handleEventSubmit = async () => {
    if (validateFields()) {
      setIsLoading(true);

      const payload = {
        employeeName: userData.employeeName,
        email: userData.email,
        // password: userData.password,
        phone: userData.phoneNumber,
        dateOfBirth: userData.dateOfBirth,
        address: userData.address,
        isActive: true,
      };

      let apiEndpoint;
      if (id) {
        apiEndpoint = "/employee/updateEmployee";
        payload.id = id;
      } else {
        apiEndpoint = "/employee/createEmployee";
      }

      const { status, message, error } = await postApi(apiEndpoint, payload);

      if (status === 200) {
        setIsLoading(false);
        successToast(message);
        navigate("/employee-details");
        setUserData(initialvalues);
      } else {
        setIsLoading(false);
        errorToast(error);
      }
    }
  };

  const fetchUserDataByID = async () => {
    const { statusCode, error, data } = await getApi(GET_EVENT_BY_ID, {
      params: { id: id },
    });
    if (statusCode === 200) {
      setUserData({
        employeeName: userData.employeeName,
        email: userData.email,
        // password: userData.password,
        phone: userData.phoneNumber,
        dateOfBirth: userData.dateOfBirth,
        address: userData.address,
      });
    } else {
      errorToast(error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserDataByID();
    }
  }, [id]);

  const handleCancel = () => {
    setUserData(initialvalues);
    setErrors({});
  };

  return (
    <CoustomLayout>
      <div className="add">
        <div className="add_sec">
          <div className="add_sec_header">
            <h2>{id ? "Update Employee Details" : "Add Employee Details"}</h2>
          </div>
          <div className="add_sec_form">
            <div className="add_sec_form_top">
              <div className="add_sec_form_top_left">
                <div className="add_sec_form_top_left_inputs">
                  <FormInputs
                    title="Employee Name"
                    placeholder="Enter Employee Name"
                    type="text"
                    name="employeeName"
                    value={userData.employeeName}
                    onChange={handleChange}
                    error={errors.employeeName}
                  />
                </div>
                <div className="add_sec_form_top_left_inputs">
                  <FormInputs
                    title="Email"
                    placeholder="Enter Email"
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    error={errors.email}
                  />
                </div>
                <div className="add_sec_form_top_left_inputs">
                  <label> Date Of Birth</label>
                  <DatePicker
                    size="large"
                    value={
                      userData.dateOfBirth ? dayjs(userData.dateOfBirth) : null
                    }
                    onChange={handleDateChange}
                  />
                  {errors.dateOfBirth && (
                    <div className="error-message">{errors.dateOfBirth}</div>
                  )}
                </div>
              </div>
              <div className="add_sec_form_top_right">
                {/* <div className="add_sec_form_top_left_inputs">
                  <FormInputs
                    title="Password"
                    placeholder="Enter Password"
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    error={errors.password}
                  />
                </div> */}
                <div className="add_sec_form_top_left_inputs">
                  <FormInputs
                    title="Phone Number"
                    placeholder="Enter Phone Number"
                    type="text"
                    name="phoneNumber"
                    value={userData.phoneNumber}
                    onChange={handleChange}
                    error={errors.phoneNumber}
                  />
                </div>
                <div className="add_sec_form_top_left_inputs">
                  <FormInputs
                    title="Address"
                    placeholder="Enter Address"
                    type="text"
                    name="address"
                    value={userData.address}
                    onChange={handleChange}
                    error={errors.address}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="add_sec_buttons">
            <div className="add_sec_buttons_cont">
              <Buttons
                variant="secondary"
                onClick={handleCancel}
                loading={isLoading}
              >
                Cancel
              </Buttons>
              <Buttons
                variant="primary"
                onClick={handleEventSubmit}
                loading={isLoading}
              >
                {id ? "Update" : "Submit"}
              </Buttons>
            </div>
          </div>
        </div>
      </div>
    </CoustomLayout>
  );
};

export default AddEmployees;
