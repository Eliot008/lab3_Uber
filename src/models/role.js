class RoleModel {
  #_id;
  #role_name;

  constructor (_id, role_name) {
    this.#_id = _id;
    this.#role_name = role_name;
  }

  toObjectInstance() {
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
