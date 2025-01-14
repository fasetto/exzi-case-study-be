import { ObjectId } from "mongodb";
import Wallet from "../models/wallet.js";
import database from "./database.js";
import BlockChain from "../lib/blockchain.js";
import redisClient from "./redis.js";

export default class WalletService {
  /** @type {import("mongodb").Collection} */
  #collection;

  /** @type {BlockChain} */
  #blockchain;

  constructor() {
    this.#collection = database.getCollection("wallets");
    this.#blockchain = new BlockChain();
  }

  /**
   * @param {Object} params
   * @param {Wallet} params.wallet
   * @param {Number} params.amount
   * @param params.session
   */
  async deposit({ wallet, amount, session = undefined }) {
    await this.#collection.updateOne(
      {
        address: wallet.address,
      },
      {
        $inc: {
          balance: amount,
        },
      },
      {
        session,
      }
    );
  }

  /**
   * @param {Object} params
   * @param {Wallet} params.wallet
   * @param {Number} params.amount
   * @param params.session
   */
  async withdraw({ wallet, amount, session = undefined }) {
    const { modifiedCount } = await this.#collection.updateOne(
      {
        address: wallet.address,
      },
      {
        $inc: {
          balance: -amount,
        },
      },
      {
        session,
      }
    );

    return modifiedCount === 1;
  }

  async createNew(userId) {
    const { publicKey, privateKey, address } =
      this.#blockchain.generateWallet();

    const wallet = new Wallet({
      publicKey,
      privateKey,
      address,
      userId,
    });

    const session = database.client.startSession();

    try {
      session.startTransaction();

      const { insertedId: walletId } = await this.#collection.insertOne(
        {
          ...wallet,
        },
        {
          session,
        }
      );

      const { matchedCount } = await database.getCollection("users").updateOne(
        {
          _id: wallet.userId,
        },
        {
          $push: {
            walletIds: walletId,
          },
        },
        {
          session,
        }
      );

      if (matchedCount === 0) {
        throw new Error("User does not exists");
      }

      await session.commitTransaction();
    } catch (error) {
      console.error(error);

      await session.abortTransaction();

      throw error;
    } finally {
      await session.endSession();
    }
  }

  async getWallets(userId) {
    return this.#collection
      .aggregate([
        {
          $match: {
            userId: ObjectId.createFromHexString(userId),
          },
        },
        {
          $project: {
            privateKey: 0,
          },
        },
      ])
      .toArray();
  }

  /** @returns {Promise<Wallet | null>} */
  async getWalletById(walletId) {
    let wallet = null;
    const cacheKey = `wallet:${walletId}`;

    wallet = await redisClient.hGetAll(cacheKey);

    const cacheHit = Object.keys(wallet).length > 0;

    if (cacheHit) {
      console.log(`Cache hit: wallet:${walletId}`);

      return new Wallet({
        ...wallet,
      });
    }

    wallet = null;
    wallet = await this.#collection.findOne(
      {
        _id: ObjectId.createFromHexString(walletId),
      },
      {
        projection: {
          privateKey: 0,
        },
      }
    );

    if (!wallet) {
      return null;
    }

    await redisClient.hSet(cacheKey, {
      ...wallet,
      _id: wallet._id.toString(),
      userId: wallet.userId.toString(),
    });

    return new Wallet({
      ...wallet,
    });
  }
}
