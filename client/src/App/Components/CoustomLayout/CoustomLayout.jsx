import React, { useEffect, useRef, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import "./CoustomLayout.scss";
import Logo from "../../assets/images/Astakenis Main Logo.png";
import user from "../../assets/images/headeruser.png";
import { useLocation, useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import { SiEnterprisedb } from "react-icons/si";
import Buttons from "../Buttons/Buttons";

const { Header, Content, Sider } = Layout;
const items = [
  {
    key: "1",
    icon: <SiEnterprisedb />,
    label: "Employee Details",
    path: "/employee-details",
  },
  {
    key: "2",
    icon: <UserOutlined />,
    label: "Add Employee",
    path: "/add",
  },
];

const CoustomLayout = ({ children }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKey = () => {
    const currentPath = location.pathname;
    const currentItem = items.find((item) => item.path === currentPath);
    return currentItem ? currentItem.key : "1";
  };

  const [selectedKey, setSelectedKey] = useState(getSelectedKey);
  useEffect(() => {
    setSelectedKey(getSelectedKey());
  }, [location.pathname]);

  const handleOpenDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDashboard = () => {
    navigate("/event-details");
  };

  const handleAdminLogout = async () => {
    localStorage.clear();
    navigate("/");
  };

  const handleCancel = () => {
    setDropdownVisible(false);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
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
      <Sider
        className="sidebar"
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {}}
        onCollapse={(collapsed, type) => {
        }}
      >
        <div className="sidebar_logo" onClick={handleDashboard}>
          {/* <img src={Logo} alt="logo" /> */}
          <h2>My Portal</h2>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={items.map(({ key, icon, label, path }) => ({
            key,
            icon,
            label,
            onClick: () => {
              navigate(path);
            },
          }))}
        />
      </Sider>
      <Layout>
        <Header
          className="header"
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <div className="header_sec">
            <div className="header_sec_logout">
              <img src={user} alt="user" onClick={handleOpenDropdown} />
              {dropdownVisible && (
                <div className="custom-dropdown" ref={dropdownRef}>
                  <h3>Are you sure you want to Logout?</h3>
                  <div className="custom-dropdown_buttons">
                    <Buttons variant="secondary" onClick={handleCancel}>
                      No
                    </Buttons>
                    <Buttons variant="primary" onClick={handleAdminLogout}>
                      Yes
                    </Buttons>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Header>
        <Content className="content">
          <div className="content_center">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default CoustomLayout;
