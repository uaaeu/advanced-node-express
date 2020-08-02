"use strict";

const express = require("express");
const fccTesting = require("./freeCodeCamp/fcctesting.js");
const ObjectID = require("mongodb").ObjectID;
const mongo = require("mongodb").MongoClient;
const LocalStrategy = require("passport-local");

const app = express();

app.set("view engine", "pug");
app.set("views", "./views/pug");

let passport = require("passport");
let session = require("express-session");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUnitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

fccTesting(app); //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongo.connect(process.env.DATABASE, (err, db) => {
  if (err) {
    console.log("Database error: " + err);
  } else {
    console.log("Successful database connection");

    app.listen(process.env.PORT || 3000, () => {
      console.log("Listening on port " + process.env.PORT);
    });

    app.route("/").get((req, res) => {
      res.render("index", { title: "Hello", message: "Please login" });
    });

    passport.serializeUser((user, done) => {
      done(null, user._id);
    });
    passport.deserializeUser((id, done) => {
      db.collection("users").findOne({ _id: new ObjectID(id) }, (err, doc) => {
        done(null, doc);
      });
    });
    passport.use(
      new LocalStrategy((username, password, done) => {
        db.collection("users").findOne({username: username}, (err, user) => {
          console.log('User ' + username + 'attempted to log in.');
          if(err) {return done(err);}
          if(!user) {return done(null, false);}
          if(password !== user.password) {return done(null, false);}
          return done(null, user);
        });
      })
    );
  }
});
