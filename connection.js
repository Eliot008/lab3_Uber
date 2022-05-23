var MongoInterface = require('./interfaces/MongoInterface');

var mongo = new MongoInterface(process.env.NODE_ENV_MONGO_URI);

mongo.connect();

module.exports = mongo;
