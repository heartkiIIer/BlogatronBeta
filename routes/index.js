var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Root route
router.get("/", (req, res) => {
	res.render("landing");
});


// Authentication Routes
// Show registration form
router.get("/register", (req, res) => {
  res.render("register");
});

// Handle sign up logic
router.post("/register", (req, res) => {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if(err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/campgrounds");
    });
  });
});

// Show Login form
router.get("/login", (req, res) => {
  res.render("login");
});

// Handle login logic
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), (req, res) => {
});

// Logout Route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/campgrounds");
});

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
}

module.exports = router;
