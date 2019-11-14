var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Articleschema = new Schema({
	title: {
		type: String,
		required: false,
	},
	link: {
		type: String,
		required: false,
	},
	summary: {
		type: String,
		default: ""
	},
	img: {
		type: String,
		 default: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=100&q=80"
	},
	issaved: {
		type: Boolean,
		default: false
	},
	status: {
		type: String,
		default: "Save Article"
	},
	created: {
		type: Date,
		default: Date.now
	},
	note: {
		type: Schema.Types.ObjectId,
		ref: "Note"
	  }
	
});

Articleschema.index({title: "text"});

var Article  = mongoose.model("Article", Articleschema);
module.exports = Article;