var Checkout = require('../models/checkout');
var Item = require('../models/item');
var Patron = require('../models/patron');

var async = require('async');


// Display Checkout create form on GET.
exports.checkout_create_get = function(req, res, next) {
    async.parallel({
        items: function(callback) {
            Item.find({status:"Available"},callback).populate('title');
        },
        patrons: function(callback) {
            Patron.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('checkout_form', { title: 'New Checkout', items: results.items, patrons: results.patrons });
        
    });
    
};

//Handle Checkout create on POST
exports.checkout_create_post = function(req, res){
var query = Patron.findById(req.body.patron);
    var checkout = new Checkout(
        {
            item: req.body.item,
            patron: req.body.patron,
            return_date: null,
            days_overdue: null
        });
        Patron.findByIdAndUpdate(req.body.patron, 
            {$push: {checkouts: checkout}
        },{ 'new': true}).exec();

        Item.findById(req.body.item, function (err, doc) {
            if (err) { return next(err); }
            doc.status = 'Loaned';
            doc.save();
          });
        checkout.save(function (err) {
        if (err) { return next(err); }
        // Successful - redirect to patron record.
        
        query.exec(function(err, patron){
            if (err) { return next(err); }

            res.redirect(patron.url);
        })
        
        
        
    });
}       

