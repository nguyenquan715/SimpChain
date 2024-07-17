import fs from "fs";
import Papa from "papaparse";

export const writeIntoFile = (path, content) => {
  fs.appendFileSync(path, content);
};

export const readFile = (path) => {
  const fileContent = fs.readFileSync(path, "utf8");
  const results = Papa.parse(fileContent, { delimiter: ",", header: false });
  return results.data.slice(1);
};
