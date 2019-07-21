var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
  {
    title: { type: Schema.Types.ObjectId, ref: 'Title', required: true }, 
    format: {type: String, required: true, enum: ['CD', "8-track", "cassette", "vinyl"]},
    status: {type: String, required: true, enum: ['Available', "Loaned"], default: 'Available'}
  }
);


ItemSchema
.virtual('url')
.get(function () {
  return '/catalog/Item/' + this._id;
});



module.exports = mongoose.model('Item', ItemSchema);