import crypto from "crypto";
import ripemd160 from "ripemd160";

export const hashBySHA256 = (data) =>
  crypto.createHash("sha256").update(data).digest("hex");

export const hashByRIPEMD160 = (data) => new ripemd160().update(data).digest();

export const compareBytes = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};
