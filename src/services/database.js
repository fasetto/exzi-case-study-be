import { MongoClient } from "mongodb";

/**
 * @typedef {import("mongodb").Db} Db
 * @typedef {import("mongodb").Collection} Collection
 */

class Database {
  #client;
  /** @type {Db} */
  #db;
  static #instance = null;

  constructor() {
    if (Database.#instance) {
      return Database.#instance;
    }

    Database.#instance = this;

    this.#client = new MongoClient(process.env.MONGODB_CONNECTION_STR);
  }

  get client() {
    return this.#client;
  }

  async connect() {
    await this.#client.connect();
    this.#db = this.#client.db(process.env.DB_NAME);
  }

  async disconnect() {
    await this.#client.close();
  }

  getCollection(collectionName) {
    return this.#db.collection(collectionName);
  }
}

const database = new Database();
await database.connect();

export default database;
