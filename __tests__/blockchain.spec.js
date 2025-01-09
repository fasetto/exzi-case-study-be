import { beforeAll, describe, expect, it } from "@jest/globals";

import BlockChain from "../src/lib/blockchain.js";
import Wallet from "../src/models/wallet.js";

describe("BlockChain", () => {
  let blockchain;

  beforeAll(() => {
    blockchain = new BlockChain();
  });

  describe("generateWallet", () => {
    it("should generate a wallet with a valid address and private key", () => {
      const wallet = blockchain.generateWallet();
      expect(wallet).toHaveProperty("address");
      expect(wallet).toHaveProperty("privateKey");
      expect(wallet).toHaveProperty("publicKey");
      expect(typeof wallet.address).toBe("string");
      expect(typeof wallet.privateKey).toBe("string");
      expect(typeof wallet.publicKey).toBe("string");
    });
  });

  describe("transferFunds", () => {
    it("should transfer funds from one wallet to another", () => {
      const senderWallet = new Wallet({ balance: 500 });
      const recipientWallet = new Wallet({ balance: 100 });
      const amount = 100;

      const transactionId = blockchain.transferFunds({
        senderWallet,
        recipientWallet,
        amount,
      });

      expect(senderWallet.balance).toBe(400);
      expect(recipientWallet.balance).toBe(200);
      expect(typeof transactionId).toBe("string");
    });

    it("should throw an error if the sender has insufficient funds", () => {
      const senderWallet = new Wallet({ balance: 50 });
      const recipientWallet = new Wallet({ balance: 100 });
      const amount = 100;

      expect(() =>
        blockchain.transferFunds({
          senderWallet,
          recipientWallet,
          amount,
        })
      ).toThrow("Insufficient balance");
    });
  });
});
