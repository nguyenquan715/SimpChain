import { Buffer } from "node:buffer";
import * as crypto from "crypto";

export const newBlock = (data, prevBlockHash) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const headers = Buffer.concat([
    Buffer.from(prevBlockHash),
    Buffer.from(data),
    Buffer.from(String(timestamp)),
  ]);
  const blockHash = crypto.createHash("sha256").update(headers).digest("hex");

  return {
    data,
    timestamp,
    prevBlockHash,
    blockHash,
  };
};

export const newGenesisBlock = () => newBlock("Genesis Block", "");
