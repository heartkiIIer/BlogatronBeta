var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

// Index - Show all campgrounds
router.get("/", (req, res) => {
	// Get all campgrounds from DB and display them on campgrounds page
	Campground.find({}, (err,  allCampgrounds) => {
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});

// New - Show form to create new campground
router.get("/new", isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
});

// Create - Add new campground to DB
router.post("/", isLoggedIn, (req, res) => {
  	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
  var desc = req.body.description;
	var author = {
		id: req.user._id,
		username:	req.user.username
	}
	var newCampground = {name: name, image: image, author: author, description: desc};

	// Create a new campground to save to DB
	Campground.create(newCampground, (err, newlyCreated) => {
		if(err){
			console.log(err);
		} else {
			// redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
});

// Show - Show more info about one campground
router.get("/:id", (req, res) => {
  Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
      if(err) {
        console.log(err);
      } else {
        // Find the campground with provided ID
        res.render("campgrounds/show", {campground: foundCampground});
      }
  });
});

// Edit - Show form for editing campground
router.get("/:id/edit", checkCampgroundOwnership, (req, res) => {
	// User is logged in and owns campground
	Campground.findById(req.params.id, (err, foundCampground) => {
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

// Update - Update campground with given data
router.put("/:id", checkCampgroundOwnership, (req, res) => {
	// User is logged in and owns campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// Delete - Delete a campground
router.delete("/:id", checkCampgroundOwnership, (req, res) =>{
	// User is logged in and owns campground
	Campground.findByIdAndRemove(req.params.id, (err) => {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
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

function checkCampgroundOwnership(req, res, next) {
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

module.exports = router;
