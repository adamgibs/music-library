var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var ArtistSchema = new Schema(
  {
    name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);





ArtistSchema
.virtual('lifespan')
.get(function () {
  return (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString();
});


ArtistSchema
.virtual('url')
.get(function () {
  return '/catalog/artist/' + this._id;
});

ArtistSchema
.virtual('date_of_birth_formatted')
.get(function () {
  return this.date_of_birth ? moment(this.date_of_birth).format('MMMM Do, YYYY'): '';
});

ArtistSchema
.virtual('date_of_death_formatted')
.get(function () {
  return this.date_of_death ? moment(this.date_of_death).format('MMMM Do, YYYY') : '';
});
module.exports = mongoose.model('Artist', ArtistSchema);