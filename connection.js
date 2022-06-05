var MongoService = require('./src/services/MongoService');

var mongo = new MongoService(process.env.NODE_ENV_MONGO_URI, process.env.NODE_ENV_DATABASE);

mongo.connect();

mongo.initialize();

module.exports = mongo;
