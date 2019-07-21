var Patron = require('../models/patron');
var Item = require('../models/item');
var Title = require('../models/title')


var async = require('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

//Displays list of patrons
exports.patron_list = function(req, res) {
    Patron.find()
    .sort([['last_name', 'ascending']])
    .exec(function (err, list_patrons) {
      if (err) { return next(err); }
      //Successful, so render
      console.log(list_patrons);
      res.render('patron_list', { title: 'Patron List', patron_list: list_patrons });
    });
};

//Display patron detail
exports.patron_detail = function(req, res, next) {
  Patron.findById(req.params.id).
  populate({
    path:'checkouts',
    options: {lean: {virtuals:true}},
    populate: {
      path:'item',
      populate:{
        path:'title'
      }
    }
  }).
  exec(function (err, patron) {
    if (err) { return next(err); }
    if (patron==null) { // No results.
        var err = new Error('Title copy not found');
        err.status = 404;
        return next(err);
      }
      var checkouts = patron.checkouts;
    // Successful, so render.
    if(checkouts != null){
      for(var i = 0; i < checkouts.length; i++){
        var one_day=1000*60*60*24;
        var due_date_ms = checkouts[i].due_date.getTime();
        var current_date_ms = new Date().getTime();
        var difference = current_date_ms - due_date_ms;
        checkouts[i].days_overdue = Math.round(difference/one_day);
      }
    }
    
    res.render('patron_detail', { title: "Patron Detail", patron:  patron, checkouts:checkouts});
  });
};

// Display Patron create form on GET.
exports.patron_create_get = function(req, res) {
  res.render('patron_form', { title: 'Add New Patron'});
};

//Handle Patron create on POST
exports.patron_create_post = [

  // Validate fields.
  body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
      .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
  body('last_name').isLength({ min: 1 }).trim().withMessage('Last name must be specified.')
      .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
  //Todo: Finish validation for rest of fields
  

  // Sanitize fields.
  sanitizeBody('first_name').trim().escape(),
  sanitizeBody('last_name').trim().escape(),
  //Todo: Finish sanitization for rest of fields
  

  // Process request after validation and sanitization.
  (req, res, next) => {

      // Extract the validation errors from a request.
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/errors messages.
          res.render('patron_form', { title: 'Create Patron', patron: req.body, errors: errors.array() });
          return;
      }
      else {
          // Data from form is valid.

          // Create an Patron object with escaped and trimmed data.
          var patron = new Patron(
              {
                  first_name: req.body.first_name,
                  last_name: req.body.last_name,
                  street:req.body.street,
                  city:req.body.city,
                  state:req.body.state,
                  zip:req.body.zip,
                  email: req.body.email,
                  is_delinquent: req.body.is_delinquent,
                  late_fees: req.body.late_fees
              });
          patron.save(function (err) {
              if (err) { return next(err); }
              // Successful - redirect to new patron record.
              res.redirect(patron.url);
          });
      }
  }
];