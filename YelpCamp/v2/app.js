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
image: String
});

var Campground = mongoose.model('Campground', campgroundSchema);
//
// Campground.create(
//   {
//     name: "Bear Ridge",
//     image: "http://www.photosforclass.com/download/6260705219"
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

app.get('/campgrounds', function(req, res) {
  Campground.find({}, function(err, AllCampgrounds){
if (err){
  console.log(err);
} else {
  res.render('campgrounds', {campgroundsVar: AllCampgrounds});
}
  });
    // res.render('campgrounds', {campgroundsVar: campgrounds});
});

app.post('/campgrounds', function(req, res) {

    // Get data from /campgrounds/new form and add data to array.
    var name = req.body.name;
    var image = req.body.image;

    // Must push new data in array as an object!
    var newCampgrounds = {name: name, image: image}
    // Create a new campground and save it to the db
    Campground.create(newCampgrounds, function(err, newlyCreated) {
        if(err) {
          console.log(err);
        } else {
          res.redirect('campgrounds')
        }
    });
    // Redirect back to /campgrounds
    res.redirect('/campgrounds');
});

app.get('/campgrounds/new', function(req, res) {
    // renders new.ejs which contains the form that pushes new data to campgrounds array.
    res.render('new');
});


/////////////////////////////////////////////////
            // Server Start Function //
/////////////////////////////////////////////////

app.listen(27017, function() {
    console.log("The YelpCamp Server Has Started");
});
