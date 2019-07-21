var Title = require('../models/title');
var Artist = require('../models/artist');
var Genre = require('../models/genre');
var Item = require('../models/item');
var Patron = require('../models/patron');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');

exports.index = function(req, res) {   
    
    async.parallel({
        title_count: function(callback) {
            Title.countDocuments({}, callback); 
        },
        item_count: function(callback) {
            Item.countDocuments({}, callback);
        },
        item_available_count: function(callback) {
            Item.countDocuments({status:'Available'}, callback);
        },
        artist_count: function(callback) {
            Artist.countDocuments({}, callback);
        },
        genre_count: function(callback) {
            Genre.countDocuments({}, callback);
        },
        patron_count: function(callback) {
            Patron.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Local Library Home', error: err, data: results });
    });
};

// Display list of all titles.
exports.title_list = function(req, res, next) {

    Title.find({}, 'name artist')
      .populate('artist')
      .exec(function (err, list_titles) {
        if (err) { return next(err); }
        res.render('title_list', { title: 'Title List', title_list: list_titles });
      });
      
  };

// Display detail page for a specific title.
exports.title_detail = function(req, res, next) {
    async.parallel({
        title: function(callback) {

            Title.findById(req.params.id)
              .populate('artist')
              .populate('genre')
              .exec(callback);
        },
        item: function(callback) {
          Item.find({ 'title': req.params.id })
          .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.title==null) { // No results.
            var err = new Error('Title not found');
            err.status = 404;
            return next(err);
        }
        
        // Successful, so render.
        res.render('title_detail', { heading: 'Title', title: results.title, items: results.item } );
    });
};

// Display title create form on GET.
exports.title_create_get = function(req, res) {
    // Get all artists and genres, which we can use for adding to our title.
    async.parallel({
        artists: function(callback) {
            Artist.find(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('title_form', { title: 'Create title', artists: results.artists, genres: results.genres });
    });
};


// Handle title create on POST.
exports.title_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre==='undefined')
            req.body.genre=[];
            else
            req.body.genre=new Array(req.body.genre);
        }
        next();
    },

    // Validate fields.
    body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
    body('artist', 'Artist must not be empty.').isLength({ min: 1 }).trim(),
    body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
    body('year', 'Year must not be empty').isLength({ min: 1 }).trim(),
  
    // Sanitize fields (using wildcard).
    sanitizeBody('*').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Title object with escaped and trimmed data.
        var title = new Title(
          { name: req.body.name,
            artist: req.body.artist,
            summary: req.body.summary,
            year: req.body.year,
            genre: req.body.genre
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all artists and genres for form.
            async.parallel({
                artists: function(callback) {
                    Artist.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (title.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.render('title_form', { heading: 'Create Title',artists:results.artists, genres:results.genres, title: title, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save title.
            title.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new title record.
                   res.redirect(title.url);
                });
        }
    }
];


// Display title delete form on GET.
exports.title_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Title delete GET');
};

// Handle title delete on POST.
exports.title_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Title delete POST');
};

// Display title update form on GET.
exports.title_update_get = function(req, res) {
    // Get title, artists and genres for form.
    async.parallel({
        title: function(callback) {
            Title.findById(req.params.id).populate('artist').populate('genre').exec(callback);
        },
        artists: function(callback) {
            Artist.find(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.title==null) { // No results.
                var err = new Error('Title not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            // Mark our selected genres as checked.
            for (var genre_iterator = 0; genre_iterator < results.genres.length; genre_iterator++) {
                for (var genre_of_title_iter = 0; genre_of_title_iter < results.title.genre.length; genre_of_title_iter++) {
                    if (results.genres[genre_iterator]._id.toString()==results.title.genre[genre_of_title_iter]._id.toString()) {
                        results.genres[genre_iterator].checked='true';
                    }
                }
            }
            res.render('title_form', { heading: 'Update Title', artists:results.artists, genres:results.genres, title: results.title });
        });
};

    // Handle title update on POST.
exports.title_update_post = [

    // Convert the genre to an array
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre==='undefined')
            req.body.genre=[];
            else
            req.body.genre=new Array(req.body.genre);
        }
        next();
    },
   
    // Validate fields.
    body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
    body('artist', 'Artist must not be empty.').isLength({ min: 1 }).trim(),
    body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
    body('year', 'Year must not be empty').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('title').trim().escape(),
    sanitizeBody('artist').trim().escape(),
    sanitizeBody('summary').trim().escape(),
    sanitizeBody('isbn').trim().escape(),
    sanitizeBody('genre.*').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Title object with escaped/trimmed data and old id.
        var title = new Title(
          { name: req.body.name,
            artist: req.body.artist,
            summary: req.body.summary,
            year: req.body.year,
            genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre,
            _id:req.params.id 
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all artists and genres for form.
            async.parallel({
                artists: function(callback) {
                    Artist.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (title.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.render('title_form', { title: 'Update Title',artists:results.artists, genres:results.genres, title: title, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Title.findByIdAndUpdate(req.params.id, title, {}, function (err,thetitle) {
                if (err) { return next(err); }
                   // Successful - redirect to title detail page.
                   res.redirect(thetitle.url);
                });
        }
    }
]