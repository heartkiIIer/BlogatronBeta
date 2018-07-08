var express = require("express"),
 		app = express(),
		bodyParser = require("body-parser"),
		mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Schema setup
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

app.get("/", (req, res) => {
	res.render("landing");
});

app.get("/campgrounds", (req, res) => {
	// Get all campgrounds from DB and display them on campgrounds page
	Campground.find({}, (err,  allCampgrounds) => {
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds", {campgrounds: allCampgrounds});
		}
	});
});

app.get("/campgrounds/new", (req, res) => {
	res.render("new");
});

app.post("/campgrounds", (req, res) => {
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image};

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

app.listen(3000, () => {
	console.log("The YelpCamp server is listening on port 3000...");
});
