var express = require('express');
var router = express.Router();

// Require controller modules.
var title_controller = require('../controllers/titleController');
var artist_controller = require('../controllers/artistController');
var genre_controller = require('../controllers/genreController');
var item_controller = require('../controllers/itemController');
var patron_controller = require('../controllers/patronController');
var checkout_controller = require('../controllers/checkoutController');

/// TITLE ROUTES ///

// GET catalog home page.
router.get('/', title_controller.index);

// GET request for creating a Title. NOTE This must come before routes that display Title (uses id).
router.get('/title/create', title_controller.title_create_get);

// POST request for creating Title.
router.post('/title/create', title_controller.title_create_post);

// GET request to delete Title.
router.get('/title/:id/delete', title_controller.title_delete_get);

// POST request to delete Title.
router.post('/title/:id/delete', title_controller.title_delete_post);

// GET request to update Title.
router.get('/title/:id/update', title_controller.title_update_get);

// POST request to update Title.
router.post('/title/:id/update', title_controller.title_update_post);

// GET request for one Title.
router.get('/title/:id', title_controller.title_detail);

// GET request for list of all Title items.
router.get('/titles', title_controller.title_list);

/// ARTIST ROUTES ///

// GET request for creating Artist. 
router.get('/artist/create', artist_controller.artist_create_get);

// POST request for creating Artist.
router.post('/artist/create', artist_controller.artist_create_post);

// GET request to delete Artist.
router.get('/artist/:id/delete', artist_controller.artist_delete_get);

// POST request to delete Artist.
router.post('/artist/:id/delete', artist_controller.artist_delete_post);

// GET request to update Artist.
router.get('/artist/:id/update', artist_controller.artist_update_get);

// POST request to update Artist.
router.post('/artist/:id/update', artist_controller.artist_update_post);

// GET request for one Artist.
router.get('/artist/:id', artist_controller.artist_detail);

// GET request for list of all Artists.
router.get('/artists', artist_controller.artist_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get);

//POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);

// GET request to delete Genre.
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET request to update Genre.
router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST request to update Genre.
router.post('/genre/:id/update', genre_controller.genre_update_post);

// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail);

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list);

/// ITEM ROUTES ///

// GET request for creating a Item. NOTE This must come before route that displays Item (uses id).
router.get('/item/create', item_controller.item_create_get);

// POST request for creating Item. 
router.post('/item/create', item_controller.item_create_post);


// POST request to update Item.
router.post('/item/:id/update', item_controller.item_update_post);

// GET request for one Item.
router.get('/item/:id', item_controller.item_detail);

// GET request for list of all Item.
router.get('/items', item_controller.item_list);

/// PATRON ROUTES ///


// GET request for creating a Patron. NOTE This must come before routes that display Patron (uses id).
router.get('/patron/create', patron_controller.patron_create_get);

// POST request for creating Patron.
router.post('/patron/create', patron_controller.patron_create_post);

// // GET request to delete Patron.
// router.get('/patron/:id/delete', patron_controller.patron_delete_get);

// // POST request to delete Patron.
// router.post('/patron/:id/delete', patron_controller.patron_delete_post);

// // GET request to update Patron.
// router.get('/patron/:id/update', patron_controller.patron_update_get);

// // POST request to update Patron.
// router.post('/patron/:id/update', patron_controller.patron_update_post);

// GET request for one Patron.
router.get('/patron/:id', patron_controller.patron_detail);

// GET request for list of all Patron items.
router.get('/patrons', patron_controller.patron_list);

/// CHECKOUT ROUTES ///


// GET request for creating a Checkout. NOTE This must come before routes that display Checkout (uses id).
router.get('/checkout/create', checkout_controller.checkout_create_get);

// POST request for creating Checkout.
router.post('/checkout/create', checkout_controller.checkout_create_post);

// // POST request for returning Checkouts.
// router.post('/checkout/:id', checkout_controller.checkout_update_post);


module.exports = router;