import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadJSON(fileName) {
    const filePath = path.join(__dirname, "..", "data", fileName);
    if (!filePath.endsWith(".json")) {
        if (fs.existsSync(filePath + ".json")) {
            return JSON.parse(fs.readFileSync(filePath + ".json", "utf8"));
        }
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`JSON not found: ${filePath}`);
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
