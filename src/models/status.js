class StatusModel {
  #_id;
  #status_name;

  constructor (_id, status_name) {
    this.#_id = _id;
    this.#status_name = status_name;
  }

  toObjectInstance() {
    const obj = {
      status_name: this.#status_name
    }

    if (this.#_id) {
      obj['_id'] = this.#_id;
    }

    return obj;
  }
}

module.exports = {
  StatusModel
};
