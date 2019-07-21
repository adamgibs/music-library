var Artist = require('../models/artist');

var async = require('async');
var Title = require('../models/title');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

//Displays list of artists
exports.artist_list = function(req, res) {
    Artist.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_artists) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('artist_list', { title: 'Artist List', artist_list: list_artists });
    });
};

// Display detail page for a specific Artist.
exports.artist_detail = function(req, res) {
    async.parallel({
        artist: function(callback) {
            Artist.findById(req.params.id)
              .exec(callback)
        },
        artist_titles: function(callback) {
          Title.find({ 'artist': req.params.id },'name year')
          .exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.artist==null) { // No results.
            var err = new Error('Artist not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('artist_detail', { title: 'Artist Detail', artist: results.artist, artist_titles: results.artist_titles } );
    });
};

// Display Artist create form on GET.
exports.artist_create_get = function(req, res) {
    res.render('artist_form', { title: 'Create Artist'});
};

// Handle Artist create on POST.
exports.artist_create_post = [

    // Validate fields.
    
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields.
    sanitizeBody('name').trim().escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('artist_form', { title: 'Create Artist', artist: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an Artist object with escaped and trimmed data.
            var artist = new Artist(
                {
                    name: req.body.name,
                    date_of_birth: req.body.date_of_birth,
                    date_of_death: req.body.date_of_death
                });

            artist.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new artist record.
                res.redirect(artist.url);
            });
        }
    }
];

// Display title delete form on GET.
exports.artist_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Title delete GET');
};

// Handle title delete on POST.
exports.artist_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Title delete POST');
};

// Handle title delete on POST.
exports.artist_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Title delete POST');
};

// Handle title delete on POST.
exports.artist_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Title delete POST');
};