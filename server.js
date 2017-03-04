// Get Dependencies
var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    morgan      = require('morgan'),
    mongoose    = require('mongoose'),
    jwt         = require('jsonwebtoken'),
    config      = require('./config'),
    User        = require('./app/models/user');

// Config Server / db connection

var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));


/*
 * API ROUTES:
 */
var apiRoutes = express.Router();

apiRoutes.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

apiRoutes.get('/setup', function(req, res) {

    // create sample user
    var nick = new User({
        name: 'Philip Lee',
        password: 'password',
        admin: true
    });

    // save sample user
    nick.save(function(err) {
        if (err) throw err;

        console.log('user save successfully');
        res.json({ success: true });
    })

});

apiRoutes.get('/users', function(req, res) {
    
    User.find({}, function(err, users) {
        res.json(users);
    })

});

app.use('/api', apiRoutes);


/* 
 * POST https://localhost:8080/api/authenticate
 * Check name & pw against database, provide token if successful.
 */

/*
 * GET https://localhost:8080/api
 * Show a random message. Protected, requires token
 */

/*
 * GET https://localhost:8080/api/users
 * List all users. Protected, requires token
 */

app.listen(port);
console.log('Magic happens at http://localhost:' + port); 