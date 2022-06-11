class AuthModel {
  #_id;
  #refresh_token;

  constructor(_id, refresh_token) {
    this.#_id = _id;
    this.#refresh_token = refresh_token;

    const obj = {
      refresh_token: this.#refresh_token,
    };

    if (this.#_id) {
      obj['_id'] = this.#_id;
    }

    return obj;
  }
}

module.exports = {
  AuthModel,
};
