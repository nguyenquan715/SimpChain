import { Buffer } from "node:buffer";
import { miningBlock } from "./proofofwork.service.js";
import { hashTransactions } from "./transaction.service.js";

export const newBlock = (transactions, prevBlockHash) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const headers = Buffer.concat([
    Buffer.from(prevBlockHash),
    Buffer.from(hashTransactions(transactions)),
    Buffer.from(String(timestamp)),
    Buffer.from(process.env.MINING_DIFFICULTY),
  ]);
  const { nonce, blockHash } = miningBlock(headers);

  return {
    headers,
    transactions,
    timestamp,
    prevBlockHash,
    blockHash,
    nonce,
  };
};

export const newGenesisBlock = (coinbaseTx) => newBlock([coinbaseTx], "");
