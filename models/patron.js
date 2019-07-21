var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PatronSchema = new Schema(
  {
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    street: {type:String, required: true},
    city: {type:String, required:true},
    state: {type: String, max: 2, required:true},
    zip:{type: String, max:5, required:true},
    email: String,
    is_delinquent: Boolean,
    late_fees: Number,
    checkouts: [{type: Schema.Types.ObjectId, ref: 'Checkout', default: []}]

  }
);

//Virtual for Patron's full name
PatronSchema
.virtual('name')
.get(function () {
  return this.last_name + ', ' + this.first_name;
});

// Virtual for Patron's URL
PatronSchema
.virtual('url')
.get(function () {
  return '/catalog/Patron/' + this._id;
});



//Export model
module.exports = mongoose.model('Patron', PatronSchema);