import React, { useState } from "react";
import "./FormInputs.scss";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import { EmailIcon, PasswordLock, SearchIcon } from "../../assets/icons";
import { BuildOutlined, UserAddOutlined } from "@ant-design/icons";

const iconMap = {
  icon1: EmailIcon,
  icon2: PasswordLock,
  icon3: SearchIcon,
  icon4: UserAddOutlined,
  icon5: BuildOutlined
};

const FormInputs = ({ title, type, value, onChange, name, placeholder, icon, onKeyDown, disabled, maxLength }) => {
  const IconComponent = iconMap[icon];
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="forminput">
      <span>{title}</span>
      <div className={`input-container ${icon ? 'with-icon' : ''}`}>
        {IconComponent && (
          <div className="icon-container">
            <IconComponent className="input-icon" />
          </div>
        )}
        <input
          className="input"
          type={type === 'password' && !showPassword ? 'password' : 'text'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
          maxLength={maxLength}
          disabled={disabled}
        />
        {type === 'password' && (
          <div className="password-toggle-icon" onClick={togglePasswordVisibility}>
            {showPassword ? <BsEyeSlash className="input-icon" /> : <BsEye className="input-icon" />}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormInputs;
