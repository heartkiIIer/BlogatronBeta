var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

// Ensure that the user is logged in and owns campground
middlewareObj.checkCampgroundOwnership = (req, res, next) => {
	// Ensure user is logged in
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCampground) => {
			if(err || !foundCampground) {
				req.flash("error", "Campground not found");
				res.redirect("/campgrounds");
			} else {
				// Ensure user is the owner of the campground
				if(foundCampground.author.id.equals(req.user._id)){
					// User owns the campground
					next();
				} else {
					// User does not own the campground
					req.flash("error", "You don't have permission to do that");
					res.redirect("/campgrounds/" + req.params.id);
				}
			}
		});
	} else {
		// User is not logged in
		req.flash("error", "You need to be logged in to do that");
		res.redirect("/login");
	}
}

// Ensure user is logged in and owns comment
middlewareObj.checkCommentOwnership = (req, res, next) => {
  // Ensure user is logged in
  if(req.isAuthenticated()) {
    // Ensure the campground corresponding to the comment exists
		Campground.findById(req.params.id, (err, foundCampground) => {
			if(err || !foundCampground) {
				req.flash("error", "Campground not found");
				return res.redirect("/campgrounds");
			} else {
				// Ensure the comment exists
				Comment.findById(req.params.comment_id, (err, foundComment) => {
		      if(err || !foundComment) {
						req.flash("error", "Comment not found");
		        res.redirect("/campgrounds/" + req.params.id);
		      } else {
		        // Ensure user is the owner of the comment
		        if(foundComment.author.id.equals(req.user._id)){
		          // User owns the comment
		          next();
		        } else {
		          // User does not own the comment
							req.flash("error", "You don't have permission to do that")
		          res.redirect("/campgrounds/" + req.params.id);
		        }
		      }
		    });
			}
		});
  } else {
    // User is not logged in
		req.flash("error", "You need to be logged in to do that");
		res.redirect("/login");
  }
}

// Check if user is logged in
middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
      return next();
    }
		req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;
