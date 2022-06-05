class UserModel {
  #_id;
  #first_name;
  #last_name;
  #email;
  #password;
  #role_id;

  constructor(_id, first_name, last_name, email, password, role_id) {
    this.#_id = _id;
    this.#first_name = first_name;
    this.#last_name = last_name;
    this.#email = email;
    this.#password = password;
    this.#role_id = role_id;
  }

  toObjectInstance() {
    const obj = {
      first_name: this.#first_name,
      last_name: this.#last_name,
      email: this.#email,
      password: this.#password,
      role_id: this.#role_id
    }

    if (this.#_id) {
      obj['_id'] = this.#_id;
    }

    return obj;
  }
}

module.exports = {
  UserModel
};
