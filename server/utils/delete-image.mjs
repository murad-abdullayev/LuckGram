import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const deleteImageFile = (filePath) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const absolutePath = path.join(__dirname, "../", filePath);

  fs.unlink(absolutePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log(`Successfully deleted file: ${absolutePath}`);
    }
  });
};
