import express from "express";
import "dotenv/config";
const app = express();
import cors from "cors";
const PORT = process.env.PORT || 8000;

// * Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cors());

app.get("/", (req, res) => {
  return res.json({ message: "Hello It's working.." });
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
