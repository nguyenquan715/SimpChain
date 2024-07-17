import elliptic from "elliptic";
import bs58 from "bs58";
import { hashByRIPEMD160, hashBySHA256 } from "../helpers/crypto.helper.js";

const EC = new elliptic.ec("p256");

class Wallet {
  constructor() {
    const { privateKey, publicKey } = newKeyPair();
    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }

  getAddress() {
    const version = 0x00;

    const pubKeyHash = hashPublicKey(this.publicKey);
    const payload = Buffer.concat([
      Buffer.from([version]),
      Buffer.from(pubKeyHash),
    ]);

    const checksum = checkSum(payload);
    const fullPayload = Buffer.concat([payload, Buffer.from(checksum)]);

    const address = bs58.encode(fullPayload);
    return address;
  }
}

export default Wallet;

const newKeyPair = () => {
  const key = EC.genKeyPair();
  const privateKey = key.getPrivate("hex");
  const publicKey = key.getPublic().encode("hex");
  return { privateKey, publicKey };
};

const hashPublicKey = (publicKey) => {
  const sha256Hash = hashBySHA256(publicKey);
  const ripemd160Hash = hashByRIPEMD160(sha256Hash);
  return ripemd160Hash;
};

const checkSum = (payload) => {
  const firstSHA = hashBySHA256(payload);
  const secondSHA = hashBySHA256(firstSHA);
  const addressChecksumLen = 4;
  return secondSHA.slice(0, addressChecksumLen);
};
