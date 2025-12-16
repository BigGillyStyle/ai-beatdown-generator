import { exiconToCsvFile } from "./index.js";

const filePath = await exiconToCsvFile();
console.log(`CSV file written to: ${filePath}`);
