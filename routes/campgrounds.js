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
router.get("/:id/edit", (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if(err) {
			res.render("/campgrounds");
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	});
});

// Update - Update campground with given data
router.put("/:id", (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if(err) {
			res.redirect("/campgrounds");
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

module.exports = router;
