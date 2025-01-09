import database from "./Database.js";
import Transfer from "../models/transfer.js";
import BlockChain from "../lib/blockchain.js";
import WalletService from "./walletService.js";

/**
 * @typedef {import("../models/wallet.js").default} Wallet
 * @typedef {import("mongodb").Collection} Collection
 */

export default class TransferService {
  /** @type {Collection} */
  #collection;

  /** @type {BlockChain} */
  #blockchain;

  /** @type {WalletService} */
  #walletService;

  constructor() {
    this.#collection = database.getCollection("transfers");
    this.#blockchain = new BlockChain();
    this.#walletService = new WalletService();
  }

  /**
   * @param {Object} params
   * @param {Wallet} params.senderWallet
   * @param {Wallet} params.recipientWallet
   * @param {Number} params.amount
   */
  async createTransaction({ senderWallet, recipientWallet, amount }) {
    const txId = this.#blockchain.transferFunds({
      senderWallet,
      recipientWallet,
      amount,
    });

    const session = database.client.startSession();

    try {
      session.startTransaction();

      const transfer = new Transfer({
        txId,
        from: senderWallet.address,
        to: recipientWallet.address,
        amount,
        timestamp: new Date(),
      });

      await this.#collection.insertOne(
        {
          ...transfer,
        },
        {
          session,
        }
      );

      await this.#walletService.deposit({
        wallet: recipientWallet,
        amount,
        session,
      });

      await this.#walletService.withdraw({
        wallet: senderWallet,
        amount,
        session,
      });

      // TODO: Logging and Alerts if (funds > $1000)

      await session.commitTransaction();

      return txId;
    } catch (error) {
      await session.abortTransaction();
      console.error(error);

      throw error;
    } finally {
      await session.endSession();
    }
  }
}
