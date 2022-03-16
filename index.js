require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const registerRouter = require("./routes/registerRouter");
const loginRouter = require("./routes/loginRouter");
const logoutRouter = require("./routes/logoutRouter");
const userRouter = require("./routes/userRouter");
const partsRouter = require("./routes/partsRouter");
const locationsRouter = require("./routes/locationsRouter");
const statusesRouter = require("./routes/statusesRouter");
const categoriesRouter = require("./routes/categoriesRouter");
const changeLocationQuantityRouter = require("./routes/changeLocationQuatityRouter");
const deletePartRouter = require("./routes/deletePartRouter");
const app = express();
const PORT = process.env.PORT;
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");

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

app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);
app.use("/api/user", userRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/parts", partsRouter);
app.use("/api/locations", locationsRouter);
app.use("/api/statuses", statusesRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/changeLocationQuantity", changeLocationQuantityRouter);
app.use("/api/delete", deletePartRouter);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = app;
