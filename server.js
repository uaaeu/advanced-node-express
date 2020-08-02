"use strict";

const express = require("express");
const fccTesting = require("./freeCodeCamp/fcctesting.js");
const mongo = require("mongodb").MongoClient;
const session = require("express-session");
const pug = require("pug");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes.js");
const auth = require("./auth.js");

const app = express();

fccTesting(app); //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "pug");

mongo.connect(
  process.env.DATABASE,
  { useUnifiedTopology: true },
  (err, client) => {
    let db = client.db("advancednode");
    if (err) {
      console.log("Database error: " + err);
    } else {
      console.log("Successful database connection");

      auth(app, db);

      routes(app, db);

      app.listen(process.env.PORT || 3000, () => {
        console.log("Listening on port " + process.env.PORT);
      });
    }
  }
);
