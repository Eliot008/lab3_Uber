const ObjectId = require('mongodb').ObjectId;

class RoleModel {
  #_id;
  #role_name;

  constructor (_id, role_name) {
    this.#_id = ObjectId(_id);
    this.#role_name = role_name;

    const obj = {
      role_name: this.#role_name
    }

    if (this.#_id) {
      obj['_id'] = this.#_id;
    }

    return obj;
  }
}

module.exports = {
  RoleModel
};
