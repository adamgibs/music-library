var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TitleSchema = new Schema(
  {
    name: {type: String, required: true},
    artist: {type: Schema.Types.ObjectId, ref: 'Artist', required: true},
    summary: {type: String, required: true},
    year: {type: String, required: true},
    genre: [{type: Schema.Types.ObjectId, ref: 'Genre'}]
  }
);

// Virtual for Title's URL
TitleSchema
.virtual('url')
.get(function () {
  return '/catalog/Title/' + this._id;
});

//Export model
module.exports = mongoose.model('Title', TitleSchema);