const ObjectId = require('mongodb').ObjectId;

class OrderModel {
  #_id;
  #price;
  #from;
  #to;
  #client_id;
  #driver_id;
  #status_id;

  constructor(_id, price, from, to, client_id, driver_id, status_id) {
    this.#_id = ObjectId(_id);
    this.#price = price;
    this.#from = from;
    this.#to = to;
    this.#client_id = ObjectId(client_id);
    this.#driver_id = ObjectId(driver_id);
    this.#status_id = ObjectId(status_id);

    const obj = {
      price: this.#price,
      from: this.#from,
      to: this.#to,
      client_id: this.#client_id,
      driver_id: this.#driver_id,
      status_id: this.#status_id,
    };

    if (this.#_id) {
      obj['_id'] = this.#_id;
    }

    return obj;
  }
}

module.exports = {
  OrderModel,
};
