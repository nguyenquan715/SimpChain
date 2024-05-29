import { newChain } from "./services/blockchain.service.js";
import "dotenv/config.js";

const chain = newChain();
chain.addBlock("First block");
chain.addBlock("Second block");
chain.addBlock("Third block");
chain.info();
