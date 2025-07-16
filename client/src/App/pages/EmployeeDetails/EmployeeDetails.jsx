import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import "./EmployeeDetails.scss"
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import CoustomLayout from "../../Components/CoustomLayout/CoustomLayout";


const EmployeeDetails = () => {
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, []);

  const fetchData = async (pageIndex, pageSize) => {
    setLoading(true);
    try {
      const response = await axios.post("/employee/getAllEmployees", {
        pageIndex,
        pageSize,
      });
      setEmployeeDetails(response.data.employees);
      setPagination({
        current: pageIndex,
        pageSize,
        total: response.totalUsers,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/`, { state: { id: id } });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/employee/deleteEmployee?id=${id}`);
      message.success("Employee deleted successfully");
      fetchData(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error("Error deleting user");
    }
  };

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (text) => (text ? dayjs(text).format("YYYY-MM-DD") : ""),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record._id)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" icon={<DeleteOutlined />} />
          </Popconfirm>
        </span>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    fetchData(pagination.current, pagination.pageSize);
  };

  return (
    <CoustomLayout>
      <Table
        columns={columns}
        dataSource={employeeDetails}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        rowKey="_id"
      />
    </CoustomLayout>
  );
};

export default EmployeeDetails;
