const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
app.use(cors({}));
app.use(express.json());
app.use("/category", require("./routes/category.js"));
app.use("/categoryType", require("./routes/categoryType.js"));
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
