import fs from 'fs';

export type FileContents = string | Buffer;

export async function saveFile(filePath: string, fileContents: FileContents) {
  await fs.promises.writeFile(filePath, fileContents);
}
