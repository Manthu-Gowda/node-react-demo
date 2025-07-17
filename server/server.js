require("dotenv").config();
const express = require("express");
const db = require("./Database/mongoDb");
const employeeRouter = require("./Routes/employeeData");
const authRouter = require("./Routes/authData");
const chatbotRouter = require("./Routes/chatbot");
const path = require("path");
const app = express();
const dotenv = require("dotenv");

dotenv.config();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// Handle all routes (important for React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use("/account", authRouter);
app.use("/employee", employeeRouter);
app.use("/chatbot", chatbotRouter);

// // Endpoint to create a user
app.post("/createUser", async (req, res) => {
  const { userName, email, password, phone, dateOfBirth, address } = req.body;
  if (!userName || !email || !password || !phone || !dateOfBirth || !address) {
    return res.status(400).send("Please provide all required fields.");
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });
    if (existingUser) {
      return res
        .status(400)
        .send("User with the same email or username already exists.");
    }

    const user = new User({
      userName,
      email,
      password,
      phone,
      dateOfBirth,
      address,
    });
    await user.save();
    res.json({
      status: 200,
      message: "User created successfully",
      data: { id: user._id },
    });
  } catch (error) {
    res.status(500).send("Error creating user: " + error.message);
  }
});

// Endpoint to get all users
app.post("/getAllUsers", async (req, res) => {
  const { pageIndex = 1, pageSize = 10, searchString = "" } = req.body;

  const query = searchString
    ? { name: { $regex: searchString, $options: "i" } } // Assuming you want to search by name
    : {};

  try {
    const users = await User.find(query)
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize);

    const totalRecords = await User.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / pageSize);

    res.json({
      users,
      totalPages,
      currentPage: pageIndex,
      totalRecords, // Include totalRecords in the response
    });
  } catch (error) {
    res.status(500).send("Error retrieving users: " + error.message);
  }
});

// Endpoint to get a user by ID
app.get("/getUserById", async (req, res) => {
  const id = req.query.id; // Mongoose handles the ID format

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.json({ status: 200, message: "User found successfully", data: user });
  } catch (error) {
    res.status(500).send("Error retrieving user: " + error.message);
  }
});

// Endpoint to update a user
app.put("/updateUser", async (req, res) => {
  const id = req.query.id; // Mongoose handles the ID format

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    const { userName, email, password, phone, dateOfBirth, address } = req.body;
    if (
      !userName &&
      !email &&
      !password &&
      !phone &&
      !dateOfBirth &&
      !address
    ) {
      return res
        .status(400)
        .send("Please provide at least one field to update.");
    }

    if (userName) user.userName = userName;
    if (email) user.email = email;
    if (password) user.password = password;
    if (phone) user.phone = phone;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (address) user.address = address;
    user.updated_at = Date.now();

    await user.save();
    res.json({ status: 200, message: "User updated successfully", data: null });
  } catch (error) {
    res.status(500).send("Error updating user: " + error.message);
  }
});

// Endpoint to delete a user
app.delete("/deleteUser", async (req, res) => {
  const id = req.query.id; // Mongoose handles the ID format

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.json({ status: 200, message: "User deleted successfully", data: null });
  } catch (error) {
    res.status(500).send("Error deleting user: " + error.message);
  }
});

//ChatBot API
// app.post("/chatbot", async (req, res) => {
//   try {
//     const { question } = req.body;
//     if (!question) return res.status(400).send("Question is required.");

//     const client = new QdrantClient({
//       url: "https://9cf4ca90-e603-4101-bc1c-35ddbe1ca7a1.us-east-1-0.aws.cloud.qdrant.io:6333",
//       apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.TVAnWG2tkvPqxirbzuGedoPorrTCRBDGQG7HAJp1gws",
//       checkCompatibility: false,
//       config: { timeout: 5000 },
//     });

//     const embeddings = new OpenAIEmbeddings({
//       openAIApiKey: "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",
//     });

//     const vectorStore = await QdrantVectorStore.fromExistingCollection(
//       embeddings,
//       {
//         client,
//         collectionName: "astakenis-site-content",
//       }
//     );

//     const results = await vectorStore.similaritySearch(question, 1);
//     const topAnswer =
//       results[0]?.pageContent || "Sorry, I couldn't find an answer for that.";

//     res.json({ answer: topAnswer });
//   } catch (err) {
//     console.error("Chatbot Error:", err?.response || err);
//     res.status(500).send("Server error.");
//   }
// });

app.listen(4000, async () => {
  await db();
  console.log("Server is running on port 4000");
});
