import { hashBySHA256 } from "../helpers/crypto.helper.js";

const getTarget = () => {
  const targetBits = BigInt(process.env.MINING_DIFFICULTY);
  let target = 1n;
  target = target << (256n - targetBits);
  return target;
};

const calculateBlockHash = (headers, nonce) => {
  const headersWithNonce = Buffer.concat([headers, Buffer.from(String(nonce))]);
  return hashBySHA256(headersWithNonce);
};

export const mining = (headers) => {
  const target = getTarget();
  let nonce = 0;
  let blockHash = "";
  while (nonce < Number.MAX_SAFE_INTEGER) {
    blockHash = calculateBlockHash(headers, nonce);
    const hashNumber = BigInt(`0x${blockHash}`);
    if (hashNumber <= target) {
      break;
    } else {
      nonce += 1;
    }
  }
  return { nonce, blockHash };
};

export const validate = (block) => {
  const { headers, nonce, blockHash } = block;
  const blockHash2 = calculateBlockHash(headers, nonce);
  if (blockHash !== blockHash2) return false;
  const hashNumber = BigInt(`0x${blockHash2}`);
  if (hashNumber > getTarget()) {
    return false;
  }
  return true;
};
