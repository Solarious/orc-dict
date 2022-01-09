'use strict';

require('dotenv').config();

var config = {
	NODE_ENV: process.env.NODE_ENV || 'development',
	PORT: Number(process.env.PORT),
	PORT_TESTING: Number(process.env.PORT_TESTING),
	MONGODB_URI: process.env.MONGODB_URI,
	MONGODB_TESTING_URI: process.env.MONGODB_TESTING_URI,
	SECRET_KEY: process.env.SECRET_KEY,
	SENDGRID_USERNAME: process.env.SENDGRID_USERNAME,
	SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
	FORCE_HTTPS: (process.env.FORCE_HTTPS === 'true'),
	SIZE_PER_PART: Number(process.env.SIZE_PER_PART || 500),
	WORK_FACTOR: Number(process.env.WORK_FACTOR || 12),
	MAX_WORDS_LOAD: (Number(process.env.MAX_WORDS_LOAD) || 200)
};

for (let key in config) {
	if (config[key] === undefined)
		throw new Error('Missing enviroment variable: ' + key);
}

module.exports = config;
