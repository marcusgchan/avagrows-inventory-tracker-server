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
const wipRouter = require("./routes/wipRouter");
const testingRouter = require("./routes/testingRouter");

// const queryForLogRouter = require("./routes/queryForLogRouter");

// const rowsRouter = require("./routes/rowsRouter");
// const convertRouter = require("./routes/convertRouter");
// const unconvertRouter = require("./routes/unconvertRouter");
// const moveLocationRouter = require("./routes/moveLocationRouter");
// const deletePartRouter = require("./routes/deletePartRouter");
// const changeQuantityRouter = require("./routes/changeQuantityRouter");
// const addPartRouter = require("./routes/addPartRouter");
// const queryPartsQuantityRouter = require("./routes/queryPartsQuantityRouter");
// const queryForTestTotalQuantityRouter = require("./routes/queryForTestTotalQuantityRouter");
// const queryForPartsQuantityQuantityRouter = require("./routes/queryForPartsQuantityQuantityRouter");
// const queryForLocationQuantityRouter = require("./routes/queryForLocationQuantityRouter");
// const queryForLocationQuantity2Router = require("./routes/queryForLocationQuantity2Router");
// const queryForGetPartsRouter = require("./routes/queryForGetPartsRouter");
// const addPartsRouter = require("./routes/addPartsRouter");
// const deletePartsRouter = require("./routes/deletePartsRouter");

// const queryForGetLocationRouter = require("./routes/queryForGetLocationRouter");
// const addPartCategoryRouter = require("./routes/addPartCategoryRouter");
// const deletePartCategoryRouter = require("./routes/deletePartCategoryRouter");
// const queryForGetPartCategoryRouter = require("./routes/queryForGetPartCategoryRouter");

// const queryForEditPartCategoryRouter = require("./routes/queryForEditPartCategoryRouter");
// const editPartCategoryRouter = require("./routes/editPartCategoryRouter");
// const queryForEditPartsRouter = require("./routes/queryForEditPartsRouter");
// const editPartsRouter = require("./routes/editPartsRouter");
// const queryForEditStatusRouter = require("./routes/queryForEditStatusRouter");
// const checkPartExists = require("./routes/checkPartExistsRouter");
// const queryForConversionQuantity = require("./routes/queryForConversionQuantity");
// const queryForConversionTotalQuantity = require("./routes/queryForConversionTotalQuantity");
// const queryForEventConvertRouter = require("./routes/queryForEventConvertRouter");
// const queryForDeleteEventsRouter = require("./routes/queryForDeleteEventsRouter");
// const queryForAddEventRouter = require("./routes/queryForAddEventRouter");
// const queryForEventLocationRouter = require("./routes/queryForEventLocationRouter");
// const queryForEventQuantityRouter = require("./routes/queryForEventQuantityRouter");
// const queryForEditLocation = require("./routes/queryForEditLocation");
// const queryForLogRouter = require("./routes/queryForLogRouter");

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

// routes related to logging in
app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);
app.use("/api/user", userRouter);
app.use("/api/logout", logoutRouter);

// routes related to the inventory table on front end
app.use("/api/inventory", inventoryRouter);
// app.use("/api/delete", deletePartRouter);
// app.use("/api/convert", convertRouter);
// app.use("/api/unconvert", unconvertRouter);
// app.use("/api/changeQuantity", changeQuantityRouter);
// app.use("/api/moveLocation", moveLocationRouter);
// app.use("/api/addPart", addPartRouter);

// routes related to parts table in table management
app.use("/api/parts", partsRouter);
// app.use("/api/addPartsRouter", addPartsRouter);
// app.use("/api/deletePartsRouter", deletePartsRouter);
// app.use("/api/editPartsRouter", editPartsRouter);
// app.use("/api/checkPartExists", checkPartExists);

// routes related to location table in table management
app.use("/api/locations", locationsRouter);
// app.use("/api/addLocation", locationsRouter);
// app.use("/api/deleteLocation", locationsRouter);
// app.use("/api/editLocationRouter", locationsRouter);

// routes for statuses table in table management
app.use("/api/statuses", statusesRouter);
// app.use("/api/addStatusRouter", statusesRouter);
// app.use("/api/editStatusRouter", statusesRouter);
// app.use("/api/deleteStatusRouter", statusesRouter);

// routes for parts category table in table management
app.use("/api/categories", categoriesRouter);
// app.use("/api/editPartCategoryRouter", editPartCategoryRouter);
// app.use("/api/addPartCategoryRouter", addPartCategoryRouter);
// app.use("/api/deletePartCategoryRouter", deletePartCategoryRouter);

// routes for wip table to be used in inventory
app.use("/api/wip", wipRouter);

// routes used for testing
app.use("/api/testing", testingRouter);
// app.use("/api/queryPartsQuantityRouter", queryPartsQuantityRouter);
// app.use(
//   "/api/queryForTestTotalQuantityRouter",
//   queryForTestTotalQuantityRouter
// );
// app.use(
//   "/api/queryForPartsQuantityQuantityRouter",
//   queryForPartsQuantityQuantityRouter
// );
// app.use("/api/queryForLocationQuantityRouter", queryForLocationQuantityRouter);
// app.use(
//   "/api/queryForLocationQuantity2Router",
//   queryForLocationQuantity2Router
// );
// app.use("/api/queryForGetPartCategoryRouter", queryForGetPartCategoryRouter);
// app.use("/api/queryForEditLocation", queryForEditLocation);
// app.use("/api/queryForEditPartCategoryRouter", queryForEditPartCategoryRouter);
// app.use("/api/queryForEditPartsRouter", queryForEditPartsRouter);
// app.use("/api/queryForEditStatusRouter", queryForEditStatusRouter);
// app.use("/api/queryForConversionQuantity", queryForConversionQuantity);
// app.use(
//   "/api/queryForConversionTotalQuantity",
//   queryForConversionTotalQuantity
// );
// app.use("/api/queryForLogRouter", queryForLogRouter);
// app.use("/api/queryForEventConvertRouter", queryForEventConvertRouter);
// app.use("/api/queryForAddEventRouter", queryForAddEventRouter);
// app.use("/api/queryForDeleteEventsRouter", queryForDeleteEventsRouter);
// app.use("/api/queryForEventLocationRouter", queryForEventLocationRouter);
// app.use("/api/queryForEventQuantityRouter", queryForEventQuantityRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = app;
