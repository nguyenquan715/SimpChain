import elliptic from "elliptic";
import bs58 from "bs58";
import {
  hashByRIPEMD160,
  hashBySHA256,
  uint8ArrayToHex,
} from "../helpers/crypto.helper.js";
import { readFile, writeIntoFile } from "../helpers/file.helper.js";
import { CHECKSUM_LENGTH, WALLET_VERSION } from "../helpers/constants.js";

export const EC = new elliptic.ec("p256");

export class Wallet {
  constructor(privateKey, publicKey) {
    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }

  getAddress() {
    const pubKeyHash = hashPublicKey(this.publicKey);
    const payload = Buffer.concat([
      Buffer.from([WALLET_VERSION]),
      Buffer.from(pubKeyHash, "hex"),
    ]);

    const checksum = checkSum(payload);
    const fullPayload = Buffer.concat([payload, Buffer.from(checksum)]);

    const address = bs58.encode(fullPayload);
    return address;
  }

  static getPubKeyHashFromAddress(address) {
    const decoded = bs58.decode(address);

    const pubKeyHash = decoded.slice(1, -CHECKSUM_LENGTH);

    return uint8ArrayToHex(pubKeyHash);
  }
}

export class WalletFactory {
  constructor() {
    this.wallets = {};
    this.walletsFilePath = "data/wallets.csv";
  }

  createWallet() {
    const { privateKey, publicKey } = newKeyPair();
    const wallet = new Wallet(privateKey, publicKey);
    const walletAddress = wallet.getAddress();
    this.wallets[walletAddress] = wallet;
    const data = `\n${walletAddress},${wallet.publicKey},${wallet.privateKey}`;
    writeIntoFile(this.walletsFilePath, data);
    return wallet;
  }

  loadWallets() {
    const walletsData = readFile(this.walletsFilePath);
    for (const [address, pubKey, privKey] of walletsData) {
      if (!this.wallets[address]) {
        this.wallets[address] = new Wallet(privKey, pubKey);
      }
    }
  }

  getWallet(address) {
    const wallet = this.wallets[address];
    if (!wallet) {
      throw new Error("ERROR: This wallet does not exist");
    }
    return wallet;
  }

  printAllAddresses() {
    Object.keys(this.wallets).forEach((address) => {
      console.log(address);
    });
  }
}

const newKeyPair = () => {
  const key = EC.genKeyPair();
  const privateKey = key.getPrivate("hex");
  const publicKey = key.getPublic("hex");
  return { privateKey, publicKey };
};

export const hashPublicKey = (publicKey) => {
  const sha256Hash = hashBySHA256(publicKey);
  const ripemd160Hash = hashByRIPEMD160(sha256Hash);
  return ripemd160Hash;
};

const checkSum = (payload) => {
  const firstSHA = hashBySHA256(payload);
  const secondSHA = hashBySHA256(firstSHA);
  return secondSHA.slice(0, CHECKSUM_LENGTH);
};
