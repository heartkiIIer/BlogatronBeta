var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

// Ensure that the user is logged in and owns campground
middlewareObj.checkCampgroundOwnership = (req, res, next) => {
	// Ensure user is logged in
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCampground) => {
			if(err) {
				res.redirect("back");
			} else {
				// Ensure user is the owner of the campground
				if(foundCampground.author.id.equals(req.user._id)){
					// User owns the campground
					next();
				} else {
					// User does not own the campground
					res.redirect("back");
				}
			}
		});
	} else {
		// User is not logged in
		res.redirect("back");
	}
}

// Ensure user is logged in and owns comment
middlewareObj.checkCommentOwnership = (req, res, next) => {
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

// Check if user is logged in
middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;
