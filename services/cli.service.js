import inquirer from "inquirer";
import { TASK } from "../helpers/constants.js";
import { newUTXOTransaction } from "./transaction.service.js";

const questions = [
  {
    type: "list",
    name: "task",
    message: "Which task you want to do?",
    choices: Object.values(TASK),
  },
  {
    type: "input",
    name: "address",
    message: "Enter the user address:",
    when(answers) {
      return answers.task === TASK.GET_BALANCE;
    },
  },
];

const printChain = (chain) => chain.info();

const sendCoin = async (chain) => {
  const questions = [
    {
      type: "input",
      name: "from",
      message: "Enter the sender address:",
    },
    {
      type: "input",
      name: "to",
      message: "Enter the receiver address:",
    },
    {
      type: "input",
      name: "amount",
      message: "Enter the transfer amount:",
    },
  ];

  try {
    const answers = await inquirer.prompt(questions);
    const { from, to, amount } = answers;
    const transaction = newUTXOTransaction(from, to, Number(amount), chain);
    chain.addBlock([transaction]);
    const latestBlockNumber = chain.getLatestBlockNumber();
    chain.getBlockInfo(latestBlockNumber);
  } catch (err) {
    console.log(err.message);
  }
};

const getBalance = (chain, address) => {
  const balance = chain.getBalanceOfUser(address);
  console.log(`Balance of ${address}: ${balance}`);
};

const createWallet = () => {
  const wallet = global.walletFactory.createWallet();
  console.log(`New wallet: '${wallet.getAddress()}'`);
};

const printAllWallets = () => {
  global.walletFactory.printAllAddresses();
};

export const doTask = (chain) => {
  console.log("********************************");
  inquirer.prompt(questions).then(async (answers) => {
    switch (answers.task) {
      case TASK.PRINT_CHAIN:
        printChain(chain);
        doTask(chain);
        break;
      case TASK.SEND_COIN:
        await sendCoin(chain);
        doTask(chain);
        break;
      case TASK.GET_BALANCE:
        getBalance(chain, answers.address);
        doTask(chain);
        break;
      case TASK.CREATE_WALLET:
        createWallet();
        doTask(chain);
        break;
      case TASK.PRINT_WALLET_ADDRESSES:
        printAllWallets();
        doTask(chain);
        break;
      case TASK.STOP:
        process.exit(0);
      default:
        console.log("Wrong task");
    }
  });
};
