
var Article = require("./models/Article");
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");

var PORT = 3000;
var app = express();
app.use(express.static("public"));


// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

const dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/newsArticles";

// Database configuration with mongoose
mongoose.set('useCreateIndex', true)
mongoose.connect(dbURI, { useNewUrlParser: true });

const db = mongoose.connection;

app.get("/", function(req, res) {
	Article.find({}, null, {sort: {created: -1}}, function(err, data) {
		if(data.length === 0) {
			res.render("placeholder", {message: "There's nothing scraped yet. Please click \"Scrape For Newest Articles\" for fresh and delicious news."});
		}
		else{
			res.render("index", {articles: data});
		}
	});
});


app.get("/scrape", function(req, res) {
 
  axios.get("https://www.nytimes.com/section/world").then(function(response) {
   
    var $ = cheerio.load(response.data);
    $("article h2").each(function(i, element) {

      var result = {};
      var summary = $(element).find("p.summary").text().trim();
			var img = $(element).parent().find("figure.media").find("img").attr("src");
     
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
		.attr("href");
	
		result.img =$(this)
		  .children("img")
		  .attr("href")

        var entry = new Article(result);
			Article.find({title: result.title}, function(err, data) {
				if (data.length === 0) {
					entry.save(function(err, data) {
						if (err) throw err;
					});
				}
			});
		});
		console.log("Scrape finished.");
		res.redirect("/");

	});
});

app.get("/saved", function(req, res) {
	Article.find({issaved: true}, null, {sort: {created: -1}}, function(err, data) {
		if(data.length === 0) {
			res.render("placeholder", {message: "You have not saved any articles yet. Try to save some delicious news by simply clicking \"Save Article\"!"});
		}
		else {
			res.render("saved", {saved: data});
		}
	});
});

app.post("/save/:id", function(req, res) {
	Article.findById(req.params.id, function(err, data) {
		if (data.issaved) {
			Article.findByIdAndUpdate(req.params.id, {$set: {issaved: false, status: "Save Article"}}, {new: true}, function(err, data) {
				res.redirect("/");
			});
		}
		else {
			Article.findByIdAndUpdate(req.params.id, {$set: {issaved: true, status: "Saved"}}, {new: true}, function(err, data) {
				res.redirect("/saved");
			});
		}
	});
});

;


app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");});
