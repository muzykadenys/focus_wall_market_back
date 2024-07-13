require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const emailRoutes = require("./src/routes/emailRoutes");

const app = express();
const port = process.env.PORT || 5000;
const origin = process.env.BASE_URL;

app.use(cors({ credentials: true, origin: origin }));

// app.use("/api/webhook", express.raw({ type: "application/json" }));

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", emailRoutes);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
