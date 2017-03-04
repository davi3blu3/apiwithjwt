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
    res.json({ message: 'Welcome to this magically delicious API'});
});

apiRoutes.get('/users', function(req, res) {
    
    User.find({}, function(err, users) {
        res.json(users);
    });
});

apiRoutes.post('/authenticate', function(req, res) {
    // find the user
    User.findOne({
        name: req.body.name
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {
                // user is found, password is corrrect
                // create a token
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresIn: 60 * 60 * 24 // expires in 24 hours
                });

                // return information inluding token as json
                res.json({
                    success: true,
                    message: 'enjoy your token!',
                    token: token
                });
            }
        }
    })
})

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