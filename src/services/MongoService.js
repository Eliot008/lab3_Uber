const { MongoClient } = require('mongodb');
const { UserModel } = require('../models/user');
const { RoleModel } = require('../models/role');
const { StatusModel } = require('../models/status');
const bcrypt = require('bcrypt');

class MongoService {
  #uri;
  #client;
  #database;

  constructor(uri, database) {
    console.log('mongo - constructor');
    this.#uri = uri;
    this.#database = database;
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

  async fillStatus() {
    console.log('fillStatus - start');
    const docs = [
      new StatusModel(undefined, 'CREATED').toObjectInstance(),
      new StatusModel(undefined, 'ACCEPTED').toObjectInstance(),
      new StatusModel(undefined, 'FINISHED').toObjectInstance(),
      new StatusModel(undefined, 'CANCELED').toObjectInstance(),
      new StatusModel(undefined, 'ONPLACE').toObjectInstance(),
    ];

    await this.#client.db(this.#database).collection('t_status').insertMany(docs);
    console.log('fillStatus - finish');
  }

  async fillRole() {
    console.log('fillRole - start');
    const docs = [
      new RoleModel(undefined, 'admin').toObjectInstance(),
      new RoleModel(undefined, 'client').toObjectInstance(),
      new RoleModel(undefined, 'driver').toObjectInstance(),
    ];

    await this.#client.db(this.#database).collection('t_role').insertMany(docs);
    console.log('fillRole - finish');
  }

  async createSuperUser() {
    const role = await this.#client.db(this.#database).collection('t_role').findOne({ role_name: 'admin' });
    bcrypt.hash(process.NODE_ENV_ADMIN_PASSWORD, Number(process.env.NODE_ENV_BCRYPT_SALT), async (err, hash) => {
      await this.#client
        .db(this.#database)
        .collection('t_user')
        .insertOne(
          new UserModel(
            undefined,
            'Admin',
            'User',
            process.env.NODE_ENV_ADMIN_EMAIL,
            hash,
            role._id.toString()
          ).toObjectInstance()
        );
    });
  }

  async createCollections(names = []) {
    names.forEach(async (name) => {
      await this.#client.db(this.#database).createCollection(name);
      console.log('Created collection - ', name);
      if (name === 't_role') {
        await this.fillRole();
        console.log('Filled collection - ', name);
      } else if (name === 't_status') {
        await this.fillStatus();
        console.log('Filled collection - ', name);
      } else if (name === 't_user') {
        await this.createSuperUser();
        console.log('Filled collection - ', name);
      }
    });
  }

  async initialize() {
    await this.connect();
    var collections_names = ['t_role', 't_status', 't_order', 't_user'];
    console.log('collections_names', collections_names);
    await this.#client.db(this.#database).collections(undefined, (err, collections) => {
      collections.forEach(function (collection) {
        console.log(collection.collectionName);

        var index = collections_names.findIndex(function (name) {
          return name === collection.collectionName;
        });
        collections_names.splice(index, 1);
      });

      this.createCollections(collections_names);
    });
  }

  async getUser(name) {
    console.log('mongo - getUser');
    try {
      // Connect to the MongoDB cluster

      var user = await this.#client.db(this.#database).collection('user').findOne({ name: name });

      return user;
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = MongoService;
