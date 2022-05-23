var { MongoClient } = require('mongodb');

class MongoInterface {
  #uri;
  #client;

  constructor(uri) {
    console.log('mongo - constructor');
    this.#uri = uri;
    this.#client = new MongoClient(uri);
  }

  async connect() {
    console.log('mongo - connect');
    await this.#client.connect();
  }

  async close() {
    console.log('mongo - close');
    await this.#client.close();
  }

  async getUser(name) {
    console.log('mongo - getUser');
    try {
      // Connect to the MongoDB cluster

      var user = await this.#client.db('Uber').collection('user').findOne({ name: name });

      return user;
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = MongoInterface;
