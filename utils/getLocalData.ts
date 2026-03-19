import path from "path";
import fs from "fs";

export default function getLocalData(fileName: string) {
    const filePath = path.join(process.cwd(), 'data', fileName);

    if (!fs.existsSync(filePath)) {
        console.warn(`Warning: ${fileName} not found at ${filePath}`);
        return null;
    }

    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error(`Error parsing ${fileName}:`, error);
        return null;
    }
}