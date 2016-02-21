var express = require("express");
var app = express();
var bodyParser = require("body-parser");

//this links the css in public folder
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


/////////////////////////////////////////////////
            // Arrays/Objects //
/////////////////////////////////////////////////

var campgrounds = [
    {name: "Salmon Creek", image: "http://www.photosforclass.com/download/10131087094"},
    {name: "Bear Ridge", image: "http://www.photosforclass.com/download/6260705219"},
    {name: "Rivers Rest", image: "http://www.photosforclass.com/download/8490155454"},
    ];
    
/////////////////////////////////////////////////
                // get and posts //
/////////////////////////////////////////////////

    

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", {campgroundsVar: campgrounds});
});

app.post("/campgrounds", function(req, res) {
    
    // Get data from /campgrounds/new form and add data to array.
    var name = req.body.name;
    var image = req.body.image;
    
    // Must push new data in array as an object!
    var newCampgrounds = {name: name, image: image}
    campgrounds.push(newCampgrounds);
    
    // Redirect back to /campgrounds
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
    // renders new.ejs which contains the form that pushes new data to campgrounds array. 
    res.render("new");
});


/////////////////////////////////////////////////
            // Server Start Function //
/////////////////////////////////////////////////

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server Has Started");    
});