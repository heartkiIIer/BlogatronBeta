var express = require("express"),
 		app = express(),
		bodyParser = require("body-parser"),
		mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// Add sample data to database
seedDB();

// Passport Configuration
app.use(require("express-session")({
  secret: "This is a sample secret text for encoding",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
  // Get campground data and send it to template
  Campground.findById(req.params.id, (err, campground) => {
      if(err) {
        console.log(err);
      } else {
        res.render("comments/new", {campground: campground});
      }
  });
});

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
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

// ==================
// AUTHENTICATION ROUTES
// ==================

// Show registration form
app.get("/register", (req, res) => {
  res.render("register");
});

// Handle sign up logic
app.post("/register", (req, res) => {
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
app.get("/login", (req, res) => {
  res.render("login");
});

// Handle login logic
app.post("/login", passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), (req, res) => {
});

// Logout Route
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
}

app.listen(3000, () => {
	console.log("The YelpCamp server is listening on port 3000...");
});
