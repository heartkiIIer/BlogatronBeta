var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

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
router.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
});

// Create - Add new campground to DB
router.post("/", middleware.isLoggedIn, (req, res) => {
  	// get data from form and add to campgrounds array
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
  var desc = req.body.description;
	var author = {
		id: req.user._id,
		username:	req.user.username
	}
	var newCampground = {name: name, price: price, image: image, author: author, description: desc};

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
      if(err || !foundCampground) {
        console.log(err);
				req.flash("error", "Campground not found");
				res.redirect("/campgrounds");
      } else {
        // Find the campground with provided ID
        res.render("campgrounds/show", {campground: foundCampground});
      }
  });
});

// Edit - Show form for editing campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
	// User is logged in and owns campground
	Campground.findById(req.params.id, (err, foundCampground) => {
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

// Update - Update campground with given data
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
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
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) =>{
	// User is logged in and owns campground
	Campground.findByIdAndRemove(req.params.id, (err) => {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Campground successfully deleted");
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;
