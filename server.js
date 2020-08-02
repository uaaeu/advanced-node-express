"use strict";

const express = require("express");
const fccTesting = require("./freeCodeCamp/fcctesting.js");
const ObjectID = require('mongodb').ObjectID;

const app = express();

app.set('view engine', 'pug')
app.set('views', './views/pug')

let passport = require('passport');
let session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUnitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

fccTesting(app); //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.route("/").get((req, res) => {
  //Change the response to render the Pug template
  res.render('index', {title: 'Hello', message: 'Please login'});
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + process.env.PORT);
});

passport.serializeUser((user, done) => {
  done(null, user._id);
})
passport.deserializeUser((id, done) => {
  // db.collection('users').findOne(
  //   {_id: new ObjectID(id)},
  //     (err, doc) => {
  //       done(null, doc);
  //     }
  // );
  done(null, null)
});