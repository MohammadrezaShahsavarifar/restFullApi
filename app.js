const express = require("express");
const port = process.env.PORT || 3000;
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const mongoose = require("mongoose");
const debug = require("debug")("app:main");
const dbdebug = require("debug")("app:db");
const userRouter = require("./routs/users");
const homeRouter = require("./routs/home");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

app.set("view engine", "ejs");
app.set("views", "./views");

debug(process.env.NODE_ENV);

if (app.get("env") === "development") {
  debug("morgan is activated");
  app.use(morgan("tiny"));
}

mongoose
  .connect("mongodb://127.0.0.1:27017/helloexpress")
  .then(() => {
    console.log("Connected To MondoDB");
  })
  .catch((err) => {
    console.log("Could not connect to Mongodb");
  });

app.use("/", homeRouter);

app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log(`listening on port :  ${port}`);
});
