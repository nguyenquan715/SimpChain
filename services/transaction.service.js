import { SUBSIDY } from "../helpers/constants.js";
import { compareBytes, hashBySHA256 } from "../helpers/crypto.helper.js";
import { hashPublicKey, Wallet } from "./wallet.service.js";

class TxOutput {
  constructor(value, address) {
    this.value = value;
    this.pubKeyHash = Wallet.getPubKeyHashFromAddress(address);
  }

  canBeUnlockedWith(pubKeyHash) {
    return compareBytes(this.pubKeyHash, pubKeyHash);
  }
}

class TxInput {
  constructor(txId, txOutputIndex, signature, publicKey) {
    this.txId = txId;
    this.txOutputIndex = txOutputIndex;
    this.signature = signature;
    this.publicKey = publicKey;
  }

  canUnlockOutputWith(pubKeyHash) {
    const lockingHash = hashPublicKey(this.publicKey);
    return compareBytes(lockingHash, pubKeyHash);
  }
}

class Transaction {
  constructor(txId, txInputs, txOutputs) {
    this.txId = txId;
    this.txInputs = txInputs;
    this.txOutputs = txOutputs;
  }

  setID() {
    const encoded = JSON.stringify(this);
    const hash = hashBySHA256(encoded);
    this.txId = hash;
  }

  isCoinbaseTx() {
    return (
      this.txInputs.length === 1 &&
      this.txInputs[0].txId === null &&
      this.txInputs[0].txOutputIndex === -1
    );
  }
}

export const hashTransactions = (transactions) => {
  const txHashes = transactions.map((tx) => Buffer.from(tx.txId, "hex"));
  const concatenatedHashes = Buffer.concat(txHashes);
  const hash = hashBySHA256(concatenatedHashes);
  return hash;
};

export const newCoinbaseTx = (to, data) => {
  if (!data) {
    data = `Reward to '${to}`;
  }

  const txInput = new TxInput(null, -1, null, Buffer.from(data));
  const txOutput = new TxOutput(SUBSIDY, to);
  const tx = new Transaction(null, [txInput], [txOutput]);
  tx.setID();

  return tx;
};

export const newUTXOTransaction = (from, to, amount, chain) => {
  const { accumulatedAmount, spendableOutputs } = chain.findSpendableOutputs(
    from,
    amount
  );
  if (accumulatedAmount < amount) {
    throw new Error("ERROR: Not enough funds");
  }

  const fromWallet = global.walletFactory.getWallet(from);
  const txInputs = [];
  Object.keys(spendableOutputs).forEach((txId) => {
    const txOutputIndexes = spendableOutputs[txId];
    txOutputIndexes.forEach((outIdx) =>
      txInputs.push(new TxInput(txId, outIdx, null, fromWallet.publicKey))
    );
  });

  const txOutputs = [new TxOutput(amount, to)];
  if (accumulatedAmount > amount) {
    txOutputs.push(new TxOutput(accumulatedAmount - amount, from));
  }

  const tx = new Transaction(null, txInputs, txOutputs);
  tx.setID();

  return tx;
};
