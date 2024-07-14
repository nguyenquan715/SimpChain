import { newChain } from "./services/blockchain.service.js";
import "dotenv/config.js";

const chain = newChain();
chain.getBlockInfo(0);
chain.addBlock("First block");
chain.getBlockInfo(1);
chain.addBlock("Second block");
chain.getBlockInfo(2);
chain.addBlock("Third block");
chain.getBlockInfo(3);
