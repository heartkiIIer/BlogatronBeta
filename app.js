var express = require("express"),
 		app = express(),
		bodyParser = require("body-parser"),
		mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Add sample data to database
seedDB();

app.get("/", (req, res) => {
	res.render("landing");
});

// INDEX - show all campgrounds
app.get("/campgrounds", (req, res) => {
	// Get all campgrounds from DB and display them on campgrounds page
	Campground.find({}, (err,  allCampgrounds) => {
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});

// NEW - show form to create new campground
app.get("/campgrounds/new", (req, res) => {
	res.render("campgrounds/new");
});

// CREATE - add new campground to DB
app.post("/campgrounds", (req, res) => {
  	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
  var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc};

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

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", (req, res) => {
  Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
      if(err) {
        console.log(err);
      } else {
        // Find the campground with provided ID
        res.render("campgrounds/show", {campground: foundCampground});
      }
  });
});

// ==================
// COMMENTS ROUTES
// ==================
app.get("/campgrounds/:id/comments/new", (req, res) => {
  // Get campground data and send it to template
  Campground.findById(req.params.id, (err, campground) => {
      if(err) {
        console.log(err);
      } else {
        res.render("comments/new", {campground: campground});
      }
  });
});

app.post("/campgrounds/:id/comments", (req, res) => {
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

app.listen(3000, () => {
	console.log("The YelpCamp server is listening on port 3000...");
});
