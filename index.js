require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const registerRouter = require("./routes/registerRouter");
const loginRouter = require("./routes/loginRouter");
const logoutRouter = require("./routes/logoutRouter");
const userRouter = require("./routes/userRouter");
const inventoryRouter = require("./routes/inventoryRouter");
const partsRouter = require("./routes/partsRouter");
const locationsRouter = require("./routes/locationsRouter");
const statusesRouter = require("./routes/statusesRouter");
const categoriesRouter = require("./routes/categoriesRouter");
const peopleRouter = require("./routes/peopleRouter");
const wipRouter = require("./routes/wipRouter");
const testingRouter = require("./routes/testingRouter");
const logsRouter = require("./routes/logsRouter");
const dashboardRouter = require("./routes/dashboardRouter");
const calibrateTotalQuantityRouter = require("./routes/calibrateTotalQuantityRouter");

const app = express();
const PORT = process.env.PORT;
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { application_name } = require("pg/lib/defaults");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("build"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

// --- Routes Used By The Front End ---

// routes related to logging in
app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);
app.use("/api/user", userRouter);
app.use("/api/logout", logoutRouter);

app.use("/api/dashboard", dashboardRouter);

// routes related to the inventory table on front end
app.use("/api/inventory", inventoryRouter);

// routes related to parts table in table management
app.use("/api/parts", partsRouter);

// routes related to location table in table management
app.use("/api/locations", locationsRouter);

// routes for statuses table in table management
app.use("/api/statuses", statusesRouter);

// routes for parts category table in table management
app.use("/api/categories", categoriesRouter);

// routes for the user table in table management
app.use("/api/people", peopleRouter);

// routes for wip table to be used in inventory
app.use("/api/wip", wipRouter);

// routes used for getting the logs
app.use("/api/logs", logsRouter);

// --- Routes Not Used By The Front End ---

// routes used for testing
// testing route is commented out as it does not take into account authentication
// app.use("/api/testing", testingRouter);

// route that calibrates the total quantity if it was manually changed in the back end
app.use("/api/calibrate", calibrateTotalQuantityRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = app;
