const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const studentRoutes = require("./routes/studentRoutes");

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

// * Middleware
app.use(cors());
app.use(express.json());

app.use("/api", studentRoutes);

app.get("/", (req, res) => {
  return res.json({ message: "Hello It's working.." });
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
