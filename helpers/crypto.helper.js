import crypto from "crypto";
import ripemd160 from "ripemd160";

export const hashBySHA256 = (data) =>
  crypto.createHash("sha256").update(data).digest("hex");

export const hashByRIPEMD160 = (data) => new ripemd160().update(data).digest();
