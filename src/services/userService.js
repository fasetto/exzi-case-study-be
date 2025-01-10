import database from "./database.js";

/**
 * @typedef {import("../models/user.js").default} User
 */

export default class UserService {
  /** @type {import("mongodb").Collection} */
  #collection;

  constructor() {
    this.#collection = database.getCollection("users");
  }

  /** @param {User} user */
  async createNew(user) {
    await this.#collection.insertOne({ ...user });
  }
}
