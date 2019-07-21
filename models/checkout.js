var mongoose = require('mongoose');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
var moment = require('moment');


var Schema = mongoose.Schema;

var CheckoutSchema = new Schema(
  {
    
    item: {type: Schema.Types.ObjectId, ref: 'Item'}, 
    patron: {type: Schema.Types.ObjectId, ref: 'Patron'},
    checkout_date: {type: Date, default: Date.now},
    //7 days from current date
    due_date: {type: Date, default: new Date(+new Date() + 7*24*60*60*1000)},
    days_overdue: {type:Number, default: 0},
    returned: {type: Boolean, default: false}

  }
);


// Virtual for Patron's URL
CheckoutSchema
.virtual('url')
.get(function () {
  return '/catalog/Checkout/' + this._id;
});

CheckoutSchema
.virtual('due_date_formatted')
.get(function () {
  return this.due_date ? moment(this.due_date).format('MMMM Do, YYYY'): '';
});

CheckoutSchema
.virtual('checkout_date_formatted')
.get(function () {
  return this.checkout_date ? moment(this.checkout_date).format('MMMM Do, YYYY'): '';
});

CheckoutSchema.plugin(mongooseLeanVirtuals);
//Export model
module.exports = mongoose.model('Checkout', CheckoutSchema);