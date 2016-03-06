var express       = require('express'),
    app           = express(),
    bodyParser    = require('body-parser'),
    mongoose      = require('mongoose'),
    passport      = require('passport'),
    localStrategy = require('passport-local'),
    User          = require('./models/user'),
    Campground    = require('./models/campground'),
    Comment       = require('./models/comment'),
    seedDB        = require('./seeds')



mongoose.connect('mongodb://localhost/yelp_camp_v6');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
seedDB();

// Passport Config
app.use(require('express-session')({
  secret: "Some secret",
  resave: false,
  saveUninitialized: false
}));

// Checks for a user on every route(.locals). next(); keeps the code moving
app.use(function(req, res, next){
  res.locals.user = req.user;
  next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes

app.get('/', function(req, res){
    res.render('landing');
});

//INDEX - show all campgrounds
app.get('/campgrounds', function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render('campgrounds/index', {campgrounds: allCampgrounds, user: req.user});
       }
    });
});

//CREATE - add new campground to DB
app.post('/campgrounds', function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect('campgrounds/campgrounds');
        }
    });
});

//NEW - show form to create new campground
app.get('/campgrounds/new', function(req, res){
   res.render('campgrounds/new', {user: req.user});
});

// SHOW - shows more info about one campground
app.get('/campgrounds/:id', function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            //render show template with that campground
            res.render('campgrounds/show', {campground: foundCampground, user: req.user});
        }
    });
});

app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res) {
  //find by ID
  Campground.findById(req.params.id, function (err, campground) {
    if(err) {
      console.log(err);
    } else {
      console.log(campground);
      res.render('comments/new', {campground: campground, user: req.user});
    }
  });
});

app.post('/campgrounds/:id/comments', isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if(err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if(err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

// ===================
// Auth Routes
// ===================

// show register form
app.get('/register', function(req, res) {
  res.render('register', {user: req.user});
});

// Handles sign up logic
app.post('/register', function(req, res) {
    var newUser = (new User({username: req.body.username}));
    User.register(newUser, req.body.password, function(err, user) {
      if (err) {
        console.log(err);
        return res.render('register');
      } else {
        passport.authenticate('local')(req, res, function() {
          res.redirect('/campgrounds');
        });
      }
    });
});

// Show Login Form Route
app.get('/login', function(req, res) {
  res.render('login', {user: req.user});
});

app.post('/login', passport.authenticate('local',
  {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }), function(req, res) {
});

// Logout Route

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
    res.redirect('/login');
}

app.listen(27017, function(){
   console.log("The YelpCamp Server Has Started!");
});
