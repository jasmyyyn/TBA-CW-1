import {Aptos, AptosConfig, Network, Account, Ed25519PrivateKey} from "@aptos-labs/ts-sdk";

async function main() {

const config = new AptosConfig({ network: Network.TESTNET }); 
const aptos = new Aptos(config);

const PRIVATE_KEY = new Ed25519PrivateKey("ed25519-priv-0x06f6003d8e76de7da489788300f7923dac8c07a5dea0468953db84e60ba86da9");

const MY_ACCOUNT = Account.fromPrivateKey({
  privateKey: PRIVATE_KEY,
});

const myBalance = await aptos.getAccountAPTAmount({
  accountAddress: MY_ACCOUNT.accountAddress,
});

let balance: string = `Your balance: ${myBalance} APT`;
console.log(balance);

const transaction = await aptos.transaction.build.simple({
  sender: MY_ACCOUNT.accountAddress,
  data: {
    function:
      "0x777b93e13ff2a1bc872eb4d099ae15a52fb70f2f01dd18d7c809e217fb0e543e::tba_exam::add_participant",
    functionArguments: [
      "0x539f880b3da2bc33d98b5efbf611eb76b6a980b0fdb15badb537767e0767d6e3",
      "Jasmyn Japag",
      "jasmyyyn",
      "japag.jasmyn@gmail.com",
      "mikari",
    ],
  },
});

const senderAuthenticator = aptos.transaction.sign({
  signer: MY_ACCOUNT,
  transaction,
});

const pendingTxn = await aptos.transaction.submit.simple({
    transaction,
    senderAuthenticator
  });


  const txnResult = await aptos.waitForTransaction({
    transactionHash: pendingTxn.hash
  });


  console.log(`Transaction status: ${txnResult.success ? "SUCCESS" : "FAILED"}`);
  console.log(`View on explorer: https://explorer.aptoslabs.com/txn/${pendingTxn.hash}?network=testnet`);

}

main().catch(console.error);