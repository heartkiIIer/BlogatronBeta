var express = require("express");
// Merge campground and comment parameters
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// Render new comment form
router.get("/new", isLoggedIn, (req, res) => {
  // Get campground data and send it to template
  Campground.findById(req.params.id, (err, campground) => {
      if(err) {
        console.log(err);s
      } else {
        res.render("comments/new", {campground: campground});
      }
  });
});

// Create a new comment
router.post("/", isLoggedIn, (req, res) => {
  // Ensure campground exists
  Campground.findById(req.params.id, (err, campground) => {
      if(err) {
        console.log(err);
        req.redirect("/campgrounds");
      } else {
        Comment.create(req.body.comment, (err, comment) => {
          if(err) {
            console.log(err);
          } else {
            campground.comments.push(comment);
            campground.save();
            res.redirect("/campgrounds/" + campground._id);
          }
        })
      }
  });
});

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
}

module.exports = router;
