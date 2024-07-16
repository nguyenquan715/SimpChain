import Blockchain from "./services/blockchain.service.js";
import "dotenv/config.js";
import { doTask } from "./services/cli.service.js";

const main = () => {
  const chain = new Blockchain();
  doTask(chain);
};

main();
