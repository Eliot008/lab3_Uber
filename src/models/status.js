const ObjectId = require('mongodb').ObjectId;

class StatusModel {
  #_id;
  #status_name;

  constructor (_id, status_name) {
    this.#_id = ObjectId(_id);
    this.#status_name = status_name;

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
