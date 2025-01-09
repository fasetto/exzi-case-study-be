import crypto from "node:crypto";

/**
 * @typedef {import("../models/wallet.js").default} Wallet
 */

/**
 * This class represents simulated blockchain environment to interact with blockchain network.
 */
export default class BlockChain {
  generateWallet() {
    const keyPair = this.#generateKeyPair();

    return {
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey,
      address: this.#generateWalletAddress(keyPair.publicKey),
    };
  }

  /**
   * @param {Object} params
   * @param {Wallet} params.senderWallet
   * @param {Wallet} params.recipientWallet
   * @param {Number} params.amount
   */
  transferFunds({ senderWallet, recipientWallet, amount }) {
    this.#validateTransaction({
      senderWallet,
      amount,
    });

    senderWallet.deductFunds(amount);
    recipientWallet.addFunds(amount);

    return crypto.randomUUID();
  }

  /**
   * @param {Object} params
   * @param {Wallet} params.senderWallet
   * @param {Number} params.amount
   * @returns
   */
  #validateTransaction({ senderWallet, amount }) {
    if (senderWallet.balance < amount) {
      throw new Error("Insufficient balance");
    }

    return true;
  }

  #generateWalletAddress(publicKey) {
    if (!publicKey) {
      throw new Error("Public key is required to generate wallet address");
    }

    const hash = crypto
      .createHash("sha256")
      .update(publicKey)
      .digest("hex")
      .slice(0, 34);

    return `1${hash}`;
  }

  #generateKeyPair() {
    const keyPair = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    return keyPair;
  }
}
