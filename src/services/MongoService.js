const { MongoClient } = require('mongodb');
const { AuthModel } = require('../models/auth');
const { UserModel } = require('../models/user');
const { RoleModel } = require('../models/role');
const { StatusModel } = require('../models/status');
const { OrderModel } = require('../models/order');
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectId;

class MongoService {
  #client;
  #database;

  constructor(uri, database) {
    console.log('mongo - constructor');
    this.#database = database;
    this.#client = new MongoClient(uri);
  }

  #collection(name) {
    return this.#client.db(this.#database).collection(name);
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
      new StatusModel(undefined, 'CREATED'),
      new StatusModel(undefined, 'ACCEPTED'),
      new StatusModel(undefined, 'FINISHED'),
      new StatusModel(undefined, 'CANCELED'),
      new StatusModel(undefined, 'ONPLACE'),
    ];

    await this.#client.db(this.#database).collection('t_status').insertMany(docs);
    console.log('fillStatus - finish');
  }

  async fillRole() {
    console.log('fillRole - start');
    const docs = [
      new RoleModel(undefined, 'admin'),
      new RoleModel(undefined, 'client'),
      new RoleModel(undefined, 'driver'),
    ];

    await this.#client.db(this.#database).collection('t_role').insertMany(docs);
    console.log('fillRole - finish');
  }

  async createSuperUser() {
    const role = await this.getRoleByName('admin');
    bcrypt.hash(process.env.NODE_ENV_ADMIN_PASSWORD, Number(process.env.NODE_ENV_BCRYPT_SALT), async (err, hash) => {
      await this.#client
        .db(this.#database)
        .collection('t_user')
        .insertOne(
          new UserModel(undefined, 'Admin', 'User', process.env.NODE_ENV_ADMIN_EMAIL, hash, role._id.toString())
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
    var collections_names = ['t_role', 't_status', 't_order', 't_user', 't_auth'];
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

  async #create(collection_name = '', data_obj) {
    console.log('CREATE: mongo - create: ', collection_name);
    try {
      const response = await this.#collection(collection_name).insertOne(data_obj);
      if (response.insertedId) return response.insertedId.toString();
      throw new Error(`${collection_name} - wasn't created`);
    } catch (e) {
      console.error(e);
    }
  }

  async #get(collection_name = '') {
    console.log('READ: mongo - get: ', collection_name);
    try {
      const cursor = await this.#collection(collection_name).find();
      const data = await cursor.toArray();
      return data;
    } catch (e) {
      console.error(e);
    }
  }

  async #getById(collection_name = '', id) {
    console.log('READ: mongo - getById: ', collection_name);
    try {
      const data = await this.#collection(collection_name).findOne({ _id: ObjectId(id) });
      return data;
    } catch (e) {
      console.error(e);
    }
  }

  async #getByRequestFilter(collection_name = '', filter = {}) {
    console.log('READ: mongo - getByRequestFilter: ', collection_name);
    try {
      const data = await this.#collection('t_role').findOne(filter);
      return data;
    } catch (e) {
      console.error(e);
    }
  }

  async #update(collection_name = '', id, data_obj) {
    console.log('UPDATE: mongo - update: ', collection_name);
    try {
      const response = await this.#collection(collection_name).updateOne({ _id: ObjectId(id) }, { $set: data_obj });
      if (response.matchedCount) return id;
      throw new Error(`${collection_name} - wasn't updated`);
    } catch (e) {
      console.error(e);
    }
  }

  async #delete(collection_name = '', id) {
    console.log('DELETE: mongo - delete: ', collection_name);
    try {
      const response = await this.#collection(collection_name).deleteOne({ _id: ObjectId(id) });
      if (response.deletedCount) return id;
      throw new Error(`${collection_name} - wasn't deleted`);
    } catch (e) {
      console.error(e);
    }
  }

  //

  async createToken(data) {
    const responseId = await this.#create('t_auth', new AuthModel(undefined, data.refresh_token));
    return responseId;
  }

  async createUser(data) {
    const responseId = await this.#create(
      't_user',
      new UserModel(undefined, data.first_name, data.last_name, data.email, data.password, data.role_id)
    );
    return responseId;
  }

  async createOrder(data) {
    const responseId = await this.#create(
      't_order',
      new OrderModel(undefined, data.price, data.from, data.to, data.client_id, data.driver_id, data.status_id)
    );
    return responseId;
  }

  //

  async getTokens() {
    const tokens = await this.#get('t_auth');
    return tokens;
  }

  async getUsers() {
    const users = await this.#get('t_user');
    return users;
  }

  async getStatuses() {
    const statuses = await this.#get('t_status');
    return statuses;
  }

  async getRoles() {
    const roles = await this.#get('t_role');
    return roles;
  }

  async getOrders() {
    const orders = await this.#get('t_order');
    return orders;
  }

  async getUser(id) {
    const user = await this.#getById('t_user', id);
    return user;
  }

  async getStatus(id) {
    const status = await this.#getById('t_status', id);
    return status;
  }

  async getRole(id) {
    const role = await this.#getById('t_role', id);
    return role;
  }

  async getRoleByName(name) {
    const role = this.#getByRequestFilter('t_role', { role_name: name });
    return role;
  }

  async getOrder(id) {
    const order = await this.#getById('t_order', id);
    return order;
  }

  //

  async updateUser(id, data) {
    const responseId = await this.#update(
      't_user',
      id,
      new UserModel(data.id, data.first_name, data.last_name, data.email, data.password, data.role_id)
    );
    return responseId;
  }

  async updateOrder(id, data) {
    const responseId = await this.#update(
      't_order',
      id,
      new OrderModel(id, data.price, data.from, data.to, data.client_id, data.driver_id, data.status_id)
    );
    return responseId;
  }

  //

  async deleteToken(id) {
    const responseId = await this.#delete('t_auth', id);
    return responseId;
  }

  async deleteUser(id) {
    const responseId = await this.#delete('t_user', id);
    return responseId;
  }

  async deleteOrder(id) {
    const responseId = await this.#delete('t_order', id);
    return responseId;
  }
}

module.exports = MongoService;
