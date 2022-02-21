require("dotenv").config();
const express = require("express");
const cors = require("cors");
const usersRouter = require("./routes/usersRouter");
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false}))
app.use(express.static("public"));

app.use("/api/users", usersRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
