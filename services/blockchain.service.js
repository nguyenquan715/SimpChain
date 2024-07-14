import { newBlock, newGenesisBlock } from "./block.service.js";
import { validate } from "./proofofwork.service.js";

export const newChain = () => {
  const blocks = [newGenesisBlock()];
  return {
    addBlock(data) {
      const prevBlockHash = blocks[blocks.length - 1].blockHash;
      const block = newBlock(data, prevBlockHash);
      blocks.push(block);
      return block;
    },
    getBlocks() {
      return blocks;
    },
    getLatestBlock() {
      return blocks[blocks.length - 1];
    },
    getBlockInfo(blockNumber) {
      const block = blocks[blockNumber];
      const { data, timestamp, prevBlockHash, blockHash, nonce } = block;
      console.log("Prev block hash: ", prevBlockHash);
      console.log("Data: ", data);
      console.log("Timestamp: ", timestamp);
      console.log("Block hash: ", blockHash);
      console.log("Nonce: ", nonce);
      console.log(`Validated: ${validate(block)}`);
      console.log("--------------------------------");
    },
    info() {
      for (let i = 0; i < blocks.length; i += 1) {
        this.getBlockInfo(i);
      }
    },
  };
};
