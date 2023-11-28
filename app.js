const express = require("express");
// const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use(express.static(path.join(__dirname, './build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});

const User = require("./models/User");

app.post("/signup", async (req, res) => {
  const { username, password, name, dob } = req.body;

  try {
    const user = new User({ username, password, name, dob });
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

app.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && user.password === password) {
      const token = jwt.sign({ username }, "your-secret-key", {
        expiresIn: "1h",
      });
      const name = user.name;

      res.json({ message: "Login successful", token, name  });
    } else {
      console.log("yaha hai");
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error during login" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

