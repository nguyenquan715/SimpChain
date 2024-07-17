import Blockchain from "./services/blockchain.service.js";
import "dotenv/config.js";
import { doTask } from "./services/cli.service.js";
import { WalletFactory } from "./services/wallet.service.js";

global.walletFactory = new WalletFactory();
global.walletFactory.loadWallets();

const main = () => {
  const chain = new Blockchain();
  doTask(chain);
};

main();
