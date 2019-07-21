#! /usr/bin/env node

console.log('This script populates some test titles, artists, genres and items to your database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var async = require('async')
var Title = require('./models/title')
var Artist = require('./models/artist')
var Genre = require('./models/genre')
var Item = require('./models/item')
var Patron = require('./models/patron')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var artists = []
var genres = []
var titles = []
var items = []
var patrons = []

function artistCreate(first_name, last_name, d_birth, d_death, cb) {
  artistdetail = {first_name:first_name , last_name: last_name }
  if (d_birth != false) artistdetail.date_of_birth = d_birth
  if (d_death != false) artistdetail.date_of_death = d_death
  
  var artist = new Artist(artistdetail);
       
  artist.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New artist: ' + artist);
    artists.push(artist)
    cb(null, artist)
  }  );
}

function genreCreate(name, cb) {
  var genre = new Genre({ name: name });
       
  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Genre: ' + genre);
    genres.push(genre)
    cb(null, genre);
  }   );
}

function titleCreate(name, artist, summary, year, genre, cb) {
  titledetail = { 
    name: name,
    artist: artist,
    summary: summary,
    year: year
  }
  if (genre != false) titledetail.genre = genre
    
  var title = new Title(titledetail);    
  title.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New title: ' + title);
    titles.push(title)
    cb(null, title)
  }  );
}


function itemCreate(title, imprint, status, due_back, cb) {
  itemdetail = { 
    title: title,
    imprint: imprint
  }    
  if (due_back != false) itemdetail.due_back = due_back
  if (status != false) itemdetail.status = status
    
  var item = new Item(itemdetail);    
  item.save(function (err) {
    if (err) {
      console.log(err.stack);
      cb(err, null)
      return
    }
    console.log('New item: ' + item);
    items.push(item)
    cb(null, title)
  }  );
}

function patronCreate(first_name, last_name, addresses, email, is_delinquent, checkouts, late_fees, cb) {
  patrondetail = { 
    first_name: first_name,
    last_name: last_name,
    addresses: addresses,
    email:email,
    is_delinquent: is_delinquent,
    checkouts:checkouts,
    late_fees:late_fees
  }    

  var patron = new Patron(patrondetail);    
  patron.save(function (err) {
    if (err) {
      console.log(err.stack);
      cb(err, null)
      return
    }
    console.log('New patron: ' + patron);
    patrons.push(patron)
    cb(null, patron)
  }  );
}


function createGenreartists(cb) {
    async.parallel([
        function(callback) {
          artistCreate('Patrick', 'Rothfuss', '1973-06-06', false, callback);
        },
        function(callback) {
          artistCreate('Ben', 'Bova', '1932-11-8', false, callback);
        },
        function(callback) {
          artistCreate('Isaac', 'Asimov', '1920-01-02', '1992-04-06', callback);
        },
        function(callback) {
          artistCreate('Bob', 'Billings', false, false, callback);
        },
        function(callback) {
          artistCreate('Jim', 'Jones', '1971-12-16', false, callback);
        },
        function(callback) {
          genreCreate("Fantasy", callback);
        },
        function(callback) {
          genreCreate("Science Fiction", callback);
        },
        function(callback) {
          genreCreate("French Poetry", callback);
        },
        ],
        // optional callback
        cb);
}


function createtitles(cb) {
    async.parallel([
        function(callback) {
          titleCreate('The White Album', artists[0], 'The Beatles self-titled album', '1969', [genres[0],], callback);
        },
        function(callback) {
          titleCreate('Led Zepelin', artists[1], 'Text', '1969', [genres[0],], callback);
        },
        function(callback) {
          titleCreate('Title 3', artists[2], 'The ', '1969', [genres[0],], callback);
        },
        function(callback) {
          titleCreate('Title 4', artists[3], 'Things', '1969', [genres[0],], callback);
        },
        function(callback) {
          titleCreate('Title 5', artists[4], 'Stuff', '1969', [genres[0],], callback);
        }
        ],
        // optional callback
        cb);
}


function createitems(cb) {
    async.parallel([
        function(callback) {
          itemCreate(titles[0], 'London Gollancz, 2014.', 'Available', false, callback)
        },
        function(callback) {
          itemCreate(titles[1], ' Gollancz, 2011.', 'Available', false, callback)
        },
        function(callback) {
          itemCreate(titles[2], ' Gollancz, 2015.', false, false, callback)
        },
        function(callback) {
          itemCreate(titles[3], 'New York Tom Doherty Associates, 2016.', 'Available', false,  callback)
        },
        function(callback) {
          itemCreate(titles[3], 'New York Tom Doherty Associates, 2016.', 'Available', false,  callback)
        },
        function(callback) {
          itemCreate(titles[3], 'New York Tom Doherty Associates, 2016.', 'Available', false,  callback)
        },
        function(callback) {
          itemCreate(titles[4], 'New York, NY Tom Doherty Associates, LLC, 2015.', 'Available', false,  callback)
        },
        function(callback) {
          itemCreate(titles[4], 'New York, NY Tom Doherty Associates, LLC, 2015.', 'Maintenance', false,  callback)
        },
        function(callback) {
          itemCreate(titles[4], 'New York, NY Tom Doherty Associates, LLC, 2015.', 'Loaned', false,  callback)
        },
        function(callback) {
          itemCreate(titles[0], 'Imprint XXX2', false, false, callback)
        },
        function(callback) {
          itemCreate(titles[1], 'Imprint XXX3', false, false, callback)
        }
        ],
        // Optional callback
        cb);
}

function createpatrons(cb) {
  async.parallel([
      function(callback) {
        patronCreate("Flemer", "Studenao", [{street:"123 6548", city:"Mkdow", state: "GA", zip:"24568"}], "fle@osid.cld",false, null,0, callback)
      }
    ],cb);
}

async.series([
    createGenreartists,
    createtitles,
    createitems,
    createpatrons
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('items: '+items);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



