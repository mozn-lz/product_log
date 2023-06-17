const passport = require('passport');
let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('../config/database');
const { User } = require('../model/user.model');

module.exports = (passport) => {
	let opts = {};
	// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	opts.secretOrKey = process.env.TZ;
	passport.use(new JwtStrategy(opts, function (Jwt_payload, done) {
		User.findOne({ where: { id: Jwt_payload.id } })
			.then((user) => done(null, user))
			.catch(err => done(null, false));
	}));
}
