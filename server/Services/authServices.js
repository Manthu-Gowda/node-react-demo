const User = require("../Modals/authSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "secret";

async function createUser(req, res) {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    return {
      status: 400,
      message: "Please provide all required fields.",
      data: null,
    };
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });
    if (existingUser) {
      return {
        status: 400,
        message: "Account with the same email or userName already exists.",
        data: null,
      };
    }

    const user = new User({
      userName,
      email,
      password,
    });
    await user.save();
    return {
      status: 200,
      message: "Account Created successfully",
      data: { id: user._id },
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error creating User: " + error.message,
      data: null,
    };
  }
}

async function userLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return {
      status: 400,
      message: "Please provide both Email and Password.",
      data: null,
    };
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return {
        status: 400,
        message: "Invalid email or password.",
        data: null,
      };
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return {
        status: 400,
        message: "Invalid email or password.",
        data: null,
      };
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, userName: user.userName, email: user.email }, // Payload
      JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Options: Token expires in 1 hour
    );

    // If login is successful
    return {
      status: 200,
      message: "Login successful",
      data: {
        token, // Include the token in the response
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error during login: " + error,
      data: null,
    };
  }
}

module.exports = {
  createUser,
  userLogin,
};
