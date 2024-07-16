import * as crypto from "crypto";

export const hashBySHA256 = (data) =>
  crypto.createHash("sha256").update(data).digest("hex");
