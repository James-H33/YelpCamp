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

var commentRoutes    = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    authRoutes       = require('./routes/index')


mongoose.connect('mongodb://localhost/yelp_camp_v8');
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

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Requiring Routes | This needs to go below Passport
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(authRoutes);

app.listen(27017, function(){
   console.log("The YelpCamp Server Has Started!");
});
