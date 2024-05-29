import * as crypto from "crypto";

export const getHeadersOfBlock = (block) => {
  const { data, timestamp, prevBlockHash } = block;
  return Buffer.concat([
    Buffer.from(prevBlockHash),
    Buffer.from(data),
    Buffer.from(String(timestamp)),
    Buffer.from(process.env.MINING_DIFFICULTY),
  ]);
};

export const calculateBlockHash = (headers, nonce) => {
  const headersWithNonce = Buffer.concat([headers, Buffer.from(String(nonce))]);
  return crypto.createHash("sha256").update(headersWithNonce).digest("hex");
};
