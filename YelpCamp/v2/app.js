var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');

// This creates the database and connects it with mongoose
mongoose.connect('mongodb://localhost/yelp_camp');
//this links the css in public folder
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


/////////////////////////////////////////////////
            // Schema Setup //
/////////////////////////////////////////////////

var campgroundSchema = new mongoose.Schema({
name: String,
image: String,
description: String
});

var Campground = mongoose.model('Campground', campgroundSchema);
//
// Campground.create(
//   {
//     name: "",
//     image: "http://www.photosforclass.com/download/6260705219",
//     description: "Dangerous yet beautiful landscape! Beware of leaving food out at night."
//
// }, function(err, campground) {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log("Newly Created Campground");
//         console.log(campground);
//       }
//   });

/////////////////////////////////////////////////
                // get and posts //
/////////////////////////////////////////////////



app.get('/', function(req, res) {
    res.render('landing');
});


// DISPLAY -- Display all Campgrounds
app.get('/campgrounds', function(req, res) {
  Campground.find({}, function(err, AllCampgrounds){
if (err){
  console.log(err);
} else {
  res.render('index', {campgroundsVar: AllCampgrounds});
}
  });
    // res.render('campgrounds', {campgroundsVar: campgrounds});
});


//CREATE -- Create new campgrounds
app.post('/campgrounds', function(req, res) {

    // Get data from /campgrounds/new form and add data to array.
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;

    // Must push new data in array as an object!
    var newCampgrounds = {name: name, image: image, description: desc}
    // Create a new campground and save it to the db
    Campground.create(newCampgrounds, function(err, newlyCreated) {
        if(err) {
          console.log(err);
        } else {
          // Redirect back to /campgrounds
          res.redirect('/campgrounds');
        }
    });
});

//NEW -- Show form to create new campgrounds
app.get('/campgrounds/new', function(req, res) {
    // renders new.ejs which contains the form that pushes new data to campgrounds array.
    res.render('new');
});

//SHOW -- Shows detailed information about specific campground
app.get('/campgrounds/:id', function(req, res) {
  // Find campground with ID
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      res.render('show', {campground: foundCampground});
    }
  });
});


/////////////////////////////////////////////////
            // Server Start Function //
/////////////////////////////////////////////////

app.listen(27017, function() {
    console.log("The YelpCamp Server Has Started");
});
