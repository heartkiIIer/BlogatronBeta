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
            // Add username and id to comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;

            // Save comment
            comment.save();

            // Add comment to campground
            campground.comments.push(comment);
            campground.save();
            res.redirect("/campgrounds/" + campground._id);
          }
        })
      }
  });
});

// Show form for editing comment
router.get("/:comment_id/edit", checkCommentOwnership, (req, res) => {
  // User is logged in and owns comment
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if(err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  })
});

// Update campground with given data
router.put("/:comment_id", checkCommentOwnership, (req,res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if(err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// Delete a campground
router.delete("/:comment_id", checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if(err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
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

// Ensure user is logged in and owns comment
function checkCommentOwnership(req, res, next) {
  // Ensure user is logged in
  if(req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if(err) {
        res.redirect("back");
      } else {
        // Ensure user is the owner of the comment
        if(foundComment.author.id.equals(req.user._id)){
          // User owns the comment
          next();
        } else {
          // User does not own the comment
          res.redirect("back");
        }
      }
    });
  } else {
    // User is not logged in
    res.redirect("back");
  }
}

module.exports = router;
