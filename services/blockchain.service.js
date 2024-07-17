import {
  GENESIS_COINBASE_DATA,
  GENESIS_RECEIVER_ADDR,
} from "../helpers/constants.js";
import { newBlock, newGenesisBlock } from "./block.service.js";
import { validateBlock } from "./proofofwork.service.js";
import { newCoinbaseTx } from "./transaction.service.js";
import { Wallet } from "./wallet.service.js";

class Blockchain {
  constructor() {
    const coinbaseTx = newCoinbaseTx(
      GENESIS_RECEIVER_ADDR,
      GENESIS_COINBASE_DATA
    );
    const genesisBlock = newGenesisBlock(coinbaseTx);
    this.blocks = [genesisBlock];
  }

  addBlock(transactions) {
    const prevBlockHash = this.getLatestBlock().blockHash;
    const block = newBlock(transactions, prevBlockHash);
    this.blocks.push(block);
    return block;
  }

  getBlocks() {
    return this.blocks;
  }

  getLatestBlockNumber() {
    return this.blocks.length - 1;
  }

  getLatestBlock() {
    return this.blocks[this.getLatestBlockNumber()];
  }

  findUTXOs(address) {
    const pubKeyHash = Wallet.getPubKeyHashFromAddress(address);
    // Mapping TxID => [{outputIndex, output}]
    const UTXOs = {};
    // Mapping TxID => [outputIndex]
    const spentTXOs = {};

    for (let i = this.getLatestBlockNumber(); i >= 0; i -= 1) {
      const block = this.blocks[i];
      for (const transaction of block.transactions) {
        const { txId, txOutputs, txInputs } = transaction;
        // Check TXOs
        for (let outIdx = 0; outIdx < txOutputs.length; outIdx += 1) {
          if (spentTXOs[txId]) {
            if (spentTXOs[txId].includes(outIdx)) continue;
          }
          if (txOutputs[outIdx].canBeUnlockedWith(pubKeyHash)) {
            if (!UTXOs[txId]) UTXOs[txId] = [];
            UTXOs[txId].push({
              txOutputIndex: outIdx,
              txOutput: txOutputs[outIdx],
            });
          }
        }

        // Update list spent TXOs
        if (transaction.isCoinbaseTx()) continue;
        txInputs.forEach((input) => {
          if (input.canUnlockOutputWith(pubKeyHash)) {
            const { txId, txOutputIndex } = input;
            if (!spentTXOs[txId]) spentTXOs[txId] = [];
            spentTXOs[txId].push(txOutputIndex);
          }
        });
      }
    }

    return UTXOs;
  }

  getBalanceOfUser(address) {
    const UTXOs = this.findUTXOs(address);
    let balance = 0;
    Object.values(UTXOs)
      .flat()
      .forEach(({ txOutput }) => (balance += txOutput.value));
    return balance;
  }

  findSpendableOutputs(address, amount) {
    const spendableOutputs = {};
    const UTXOs = this.findUTXOs(address);
    let accumulatedAmount = 0;
    for (const [txId, txOutputs] of Object.entries(UTXOs)) {
      for (const { txOutputIndex, txOutput } of txOutputs) {
        if (accumulatedAmount < amount) {
          accumulatedAmount += txOutput.value;
          if (!spendableOutputs[txId]) spendableOutputs[txId] = [];
          spendableOutputs[txId].push(txOutputIndex);
        } else {
          break;
        }
      }
      if (accumulatedAmount >= amount) break;
    }
    return { accumulatedAmount, spendableOutputs };
  }

  getBlockInfo(blockNumber) {
    const block = this.blocks[blockNumber];
    const { transactions, timestamp, prevBlockHash, blockHash, nonce } = block;
    console.log("Prev block hash: ", prevBlockHash);
    console.log(
      "Transactions: ",
      transactions.map((tx) => tx.txId)
    );
    console.log("Timestamp: ", timestamp);
    console.log("Block hash: ", blockHash);
    console.log("Nonce: ", nonce);
    console.log(`Validated: ${validateBlock(block)}`);
    console.log("--------------------------------");
  }

  info() {
    for (let i = 0; i < this.blocks.length; i += 1) {
      this.getBlockInfo(i);
    }
  }
}

export default Blockchain;
