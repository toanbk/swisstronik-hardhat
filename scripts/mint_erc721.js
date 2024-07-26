// Import necessary modules from Hardhat and SwisstronikJS
const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

// Function to send a shielded transaction using the provided signer, destination, data, and value
const sendShieldedTransaction = async (signer, destination, data, value) => {
  // Get the RPC link from the network configuration
  const rpcLink = hre.network.config.url;

  // Encrypt transaction data
  const [encryptedData] = await encryptDataField(rpcLink, data);

  // Construct and sign transaction with encrypted data
  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  // Address of the deployed contract
  const contractAddress = "0x40E6FF3411eFA502eE4Aa153a43841d82F63a599";

  // Get the signer (your account)
  const [signer] = await hre.ethers.getSigners();

  // Create a contract instance
  const contractFactory = await hre.ethers.getContractFactory("Token721");
  const contract = contractFactory.attach(contractAddress);

  // Define the function name for preminting and the address to receive the token
  const functionName = "premint";
  const receiverAddress = signer.address;

  // Encode the function data with the receiver address
  const encodedFunctionData = contract.interface.encodeFunctionData(functionName, [receiverAddress]);

  // Send a shielded transaction to mint an ERC-721 token in the contract
  const premintTokenTx = await sendShieldedTransaction(
    signer,
    contractAddress,
    encodedFunctionData,
    0
  );

  await premintTokenTx.wait();

  // It should return a TransactionReceipt object
  console.log("Transaction Receipt: ", premintTokenTx);
}

// Using async/await pattern to handle errors properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
