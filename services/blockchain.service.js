import { newBlock, newGenesisBlock } from "./block.service.js";

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
    info() {
      for (const block of blocks) {
        const { data, timestamp, prevBlockHash, blockHash } = block;
        console.log(prevBlockHash);
        console.log(data);
        console.log(timestamp);
        console.log(blockHash);
        console.log("--------------------------------");
      }
    },
  };
};
