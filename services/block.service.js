import { Buffer } from "node:buffer";
import { mining } from "./proofofwork.service.js";

export const newBlock = (data, prevBlockHash) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const headers = Buffer.concat([
    Buffer.from(prevBlockHash),
    Buffer.from(data),
    Buffer.from(String(timestamp)),
    Buffer.from(process.env.MINING_DIFFICULTY),
  ]);
  const { nonce, blockHash } = mining(headers);

  return {
    headers,
    data,
    timestamp,
    prevBlockHash,
    blockHash,
    nonce,
  };
};

export const newGenesisBlock = () => newBlock("Genesis Block", "");
