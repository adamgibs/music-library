var Item = require('../models/item');
var Title = require('../models/title');
var Checkout = require('../models/checkout');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Items.
exports.item_list = function(req, res) {
    Item.find()
    .populate('title')
    .exec(function (err, list_items) {
      if (err) { return next(err); }
      // Successful, so render
      res.render('item_list', { title: 'Item List', item_list: list_items });
    });
    
};

// Display detail page for a specific Item.
exports.item_detail = function(req, res) {
    Item.findById(req.params.id)
    .populate('title')
    .exec(function (err, item) {
      if (err) { return next(err); }
      if (item==null) { // No results.
          var err = new Error('Title copy not found');
          err.status = 404;
          return next(err);
        }
      // Successful, so render.
      res.render('item_detail', { title: 'Title:', item:  item});
    })
};

// Display Item create form on GET.
exports.item_create_get = function(req, res) {
    Title.find({},'name')
    .exec(function (err, titles) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('item_form', {heading: 'Create Item', title_list:titles});
    });
};

// Handle Item create on POST.
exports.item_create_post = [

    // Validate fields.
    body('title', 'Title must be specified').isLength({ min: 1 }).trim(),

    
    // Sanitize fields.
    sanitizeBody('title').trim().escape(),
    sanitizeBody('format').trim().escape(),
    sanitizeBody('status').trim().escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create an Item object with escaped and trimmed data.
        var item = new Item(
          { title: req.body.title,
            format: req.body.format,
            status: req.body.status
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Title.find({},'title')
                .exec(function (err, titles) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.render('item_form', { title: 'Create Item', title_list : titles, selected_title : item.title._id , errors: errors.array(), item:item });
            });
            return;
        }
        else {
            // Data from form is valid.
            item.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new record.
                   res.redirect(item.url);
                });
        }
    }
];




// Handle item update on POST.
exports.item_update_post = function(req, res) {
    Item.findByIdAndUpdate(req.params.id, {status:"Available"}).exec();
    
};