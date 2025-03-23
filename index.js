const express = require("express");
const cors = require("cors");
const connectDB = require("./config/Server");
const AuthRoute = require("./routes/AuthRoutes");
const BankRoute = require("./routes/BankRoutes");
const EmailRoute = require("./routes/EmailRoute");
const MessageRoute = require("./routes/ReportRoutes");
const AdminAuthRoute = require("./routes/AdminAuth");
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hellow server");
});

app.use("/api", AuthRoute);
app.use("/api", BankRoute);
app.use("/api", EmailRoute);
app.use("/api", MessageRoute);
app.use("/api",AdminAuthRoute)

connectDB();
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
