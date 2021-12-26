const { execSync } = require("child_process");

const verifyCmd = (contractName, contractAddr, networkName) => {
  return `npx truffle run verify ${contractName}@${contractAddr} --network ${networkName}`;
};

// Verify and publish to explorer
const execVerifyCmd = (contractName, contractAddr, networkName) => {
  // Ganache case
  if (!networkName) {
    return;
  }

  let RETRIES = 5;

  try {
    execSync(verifyCmd(contractName, contractAddr, networkName));
    console.log(
      `Successfully publish contractName:${contractName}, contractAddr:${contractAddr} `
    );
  } catch (err) {
    while (RETRIES > 0) {
      RETRIES--;
      try {
        execSync(verifyCmd(contractName, contractAddr, networkName));
        console.log(
          `Successfully publish contractName:${contractName}, contractAddr:${contractAddr} `
        );
        return;
      } catch (err2) {}
    }

    console.log(
      `Cannot publish contractName:${contractName}, contractAddr:${contractAddr} `
    );
    console.log("Error:", err);
  }
};

module.exports = execVerifyCmd;
