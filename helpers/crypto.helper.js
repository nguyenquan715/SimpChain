import crypto from "crypto";

export const hashBySHA256 = (data) =>
  crypto.createHash("sha256").update(data).digest("hex");

export const hashByRIPEMD160 = (data) =>
  crypto.createHash("ripemd160").update(data).digest("hex");

export const uint8ArrayToHex = (uint8Array) =>
  Array.from(uint8Array)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
