import inquirer from "inquirer";

const TASK = Object.freeze({
  PRINT_CHAIN: "Print out chain information",
  ADD_BLOCK: "Add new block",
  STOP: "Stop",
});

const questions = [
  {
    type: "list",
    name: "task",
    message: "Which task you want to do?",
    choices: [TASK.PRINT_CHAIN, TASK.ADD_BLOCK, TASK.STOP],
  },
  {
    type: "input",
    name: "blockData",
    message: "Enter the block data:",
    when(answers) {
      return answers.task === TASK.ADD_BLOCK;
    },
  },
];

const printChain = (chain) => chain.info();

const addBlock = (chain, data) => {
  chain.addBlock(data);
  const latestBlockNumber = chain.getLatestBlockNumber();
  chain.getBlockInfo(latestBlockNumber);
};

export const doTask = (chain) => {
  inquirer.prompt(questions).then((answers) => {
    switch (answers.task) {
      case TASK.PRINT_CHAIN:
        printChain(chain);
        doTask(chain);
        break;
      case TASK.ADD_BLOCK:
        addBlock(chain, answers.blockData);
        doTask(chain);
        break;
      case TASK.STOP:
        process.exit(0);
      default:
        console.log("Wrong task");
    }
  });
};
