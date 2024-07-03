const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: '.env' });
const jwtSecret = process.env.JWT_SECRET_KEY;

function encryptPassword(response, user) {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(user.password, salt, (err, hash) => {
			if (err) throw err;
			user.password = hash;
			user.save()
				.then(user => {
					response.send({ message: 'Registration successful!' })
				})
				.catch(err => console.log(err));
		});
	});
}

exports.signup = (req, res) => {
	console.log(req.body);
	const { email, password } = req.body;
	User.findOne({ email: email })
		.then(user => {
			if (user) {
				res.status(400).json({ message: 'Email already exists' });
			} else {
				const newUser = new User({ email, password });
				encryptPassword(res, newUser);
			}
		})
}

exports.login = (req, res) => {
	console.log(req.body);
	const { email, password } = req.body;
	User.findOne({ email: email })
		.then(user => {
			if (!user) {
				res.send({ msessage: 'Email not found' });
			} else {
				bcrypt.compare(password, user.password, (err, matches) => {
					if (matches) {
						const signedToken = jwt.sign({ email: email, userId:user._id }, jwtSecret, { expiresIn: '1h' })
						console.log(signedToken);
						res.send({ token: signedToken });
					}
				})
			}
		})
}

exports.verify = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		if (!token) {
			return res.status(401).json({ message: 'Auth token is missing!' });
		}
		const decodedToken = jwt.verify(token, jwtSecret);
		req.userData = { userId: decodedToken.userId };
		next();
	} catch (error) {
		res.status(401).json({ message: 'Auth failed!' });
	}
}





exports.authenticated = (req, res) => {
	res.send('Authenticated page');
}
