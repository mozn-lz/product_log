const bcryptjs = require('bcryptjs');
const rounds = 11;
const salt = 'r0llyp0lly';

let encrypt = (password) => {
	return new Promise((res, rej) => {
		bcrypt.genSalt(rounds, (err, asd) => {
			bcryptjs.hash(password, salt, (err, hash) => {
				err ? rej(err) : res(hash);
			});
		});
	});
}

let compare = (hash, password) => {
	return new Promise((resolve, reject) => {
		bcryptjs.compare(password, hash)
			.then(res => resolve(res))
			.catch(err => reject(err));
	});
}

module.exports = {
	encrypt,
	compare
}
