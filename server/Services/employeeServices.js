const Employee = require("../Modals/employeeSchema");

async function createEmployee(req, res) {
  const { employeeName, email, phone, dateOfBirth, address } = req.body;
  if (!employeeName || !email || !phone || !dateOfBirth || !address) {
    return {
      status: 400,
      message: "Please provide all required fields.",
      data: null,
    };
  }

  try {
    const existingEmployee = await Employee.findOne({
      $or: [{ email }, { employeeName }],
    });
    if (existingEmployee) {
      return {
        status: 400,
        message: "Employee with the same email or employeeName already exists.",
        data: null,
      };
    }

    const employee = new Employee({
      employeeName,
      email,
      phone,
      dateOfBirth,
      address,
    });
    await employee.save();
    return {
      status: 200,
      message: "Employee Added successfully",
      data: { id: employee._id },
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error creating Employee: " + error.message,
      data: null,
    };
  }
}

async function getAllEmployees(req, res) {
  const { pageIndex = 1, pageSize = 10, searchString = "" } = req.body;

  const query = searchString
    ? { name: { $regex: searchString, $options: "i" } }
    : {};

  try {
    const employees = await Employee.find(query)
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize);

    const totalRecords = await Employee.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / pageSize);

    return {
      status: 200,
      message: "Employees retrieved successfully",
      data: {
        employees,
        totalPages,
        currentPage: pageIndex,
        totalRecords,
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error creating employee: " + error.message,
      data: null,
    };
  }
}

async function getEmployeeById(req, res) {
  const id = req.query.id; // Mongoose handles the ID format

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return {
        status: 404,
        message: "Employee not found.",
        data: null,
      };
    }
    return {
      status: 200,
      message: "Employee found successfully",
      data: employee,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error retrieving Employee: " + error.message,
      data: null,
    };
  }
}

async function updateEmployee(req, res) {
  const id = req.query.id; // Mongoose handles the ID format

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return {
        status: 404,
        message: "Employee not found",
        data: null,
      };
    }

    const { employeeName, email, phone, dateOfBirth, address } = req.body;
    if (
      !employeeName &&
      !email &&
      !phone &&
      !dateOfBirth &&
      !address
    ) {
      // return res
      //   .status(400)
      //   .send("Please provide at least one field to update.");
      return {
        status: 400,
        message: "Please provide at least one field to update",
        data: null,
      };
    }

    if (employeeName) employee.employeeName = employeeName;
    if (email) employee.email = email;
    if (phone) employee.phone = phone;
    if (dateOfBirth) employee.dateOfBirth = dateOfBirth;
    if (address) employee.address = address;
    employee.updated_at = Date.now();

    await employee.save();
    return {
      status: 200,
      message: "Employee updated successfully",
      data: null,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error updating employee: " + error.message,
      data: null,
    };
  }
}

async function deleteEmployee(req, res) {
  const id = req.query.id; // Mongoose handles the ID format

  try {
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return {
        status: 404,
        message: "Employee not found",
        data: null,
      };
    }
    return {
      status: 200,
      message: "Employee deleted successfully",
      data: null,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error deleting employee: " + error.message,
      data: null,
    };
  }
}

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
