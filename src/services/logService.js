import database from "./Database.js";

export default class LogService {
  /** @type {import("mongodb").Collection} */
  #collection;

  constructor() {
    this.#collection = database.getCollection("logs");
  }

  /** @param {import("../models/log.js").default} log */
  async append(log) {
    await this.#collection.insertOne(log);
  }
}
