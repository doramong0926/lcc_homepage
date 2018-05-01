var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/mongoose/user');

// Login
router.get('/login', function (req, res) {
  	res.render('/');
});

// Logout
router.get('/logout', function (req, res) {
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/');
});

// Register
router.get('/register', function (req, res) {
	res.render('/');
});

// Post login
router.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/', failureFlash: true}),
	function (req, res) {
		console.log(req.body);
		res.json({sucess : 'true'});
});  

// post Register
router.post('/register', function (req, res) {
	var email = req.body.email;
	var password = req.body.password;
	var password_confirmation = req.body.password_confirmation;

	console.log('email : ' + email + '  password : ' + password + '  password_confirmation : ' + password_confirmation);

	// Validation
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password_confirmation', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();
	if (errors) {
		/*
		res.render('register', {
			errors: errors
		});*/
		res.json({sucess : 'false'});
		console.log(errors);
	}
	else {
		//checking for email and is already taken
		User.findOne({ email: { 
			"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
				if (mail) {
					res.render('register', {
						mail: mail
					});
				}
				else {
					var newUser = new User({
						email: email,
						password: password
					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});
					req.flash('success_msg', 'You are registered and can now login');
					res.json({sucess : 'true'});
				}
		});
	}
});

passport.use('local', new LocalStrategy({
		usernameField : 'email', 
		passwordField : 'password', 
		passReqToCallback : true
	}, 
	function (req, email, password, done) {
		var email = req.body.email;
		var password = req.body.password;
		User.getUserByEmail(email, function (err, user) {
			if (err) throw err;
			if (!user) {
				//res.json({sucess: false});
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					//res.json({sucess: 'true'});
					return done(null, user);
				} else {
					//res.json({sucess: 'false'});
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});


module.exports = router;