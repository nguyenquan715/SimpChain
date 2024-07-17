import Blockchain from "./services/blockchain.service.js";
import "dotenv/config.js";
import { doTask } from "./services/cli.service.js";
import Wallet from "./services/wallet.service.js";

const main = () => {
  // const chain = new Blockchain();
  // doTask(chain);
  const wallet = new Wallet();
  console.log(wallet.publicKey);
  console.log(wallet.privateKey);
  console.log(wallet.getAddress());
};

main();
