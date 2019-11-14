var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Noteschema = new Schema({
	title: {
		type: String,
	},
	body: {
		type: String,
	}
});

var Note = mongoose.model("Note", Noteschema);
module.exports = Note;