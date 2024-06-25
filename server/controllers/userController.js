const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

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
				res.send({ message: 'Account already exists' });
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
						const signedToken = jwt.sign({ email: email }, jwtSecret, { expiresIn: '5m' })
						console.log(signedToken);
						res.send({ token: signedToken });
					}
				})
			}
		})
}

exports.verify = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (token == null) return res.sendStatus(401);

	jwt.verify(token, jwtSecret, (err, user) => {
		if (err) {
			return res.sendStatus(403);
		}
		req.user = user;
		next();
	});
}


exports.updateAnUserImage = (req, res) => {
	const id = req.params._id;

	if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

	const path = req.file.path.replace(/\\/g, "/")

	User.findByIdAndUpdate(id, req.body = { ProfilePicture: "http://localhost:3000/" + path }, { new: true });
	res.json(updateAnUser);
}


exports.authenticated = (req, res) => {
	res.send('Authenticated page');
}
