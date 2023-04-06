import path from 'node:path';
import { URL, fileURLToPath } from 'node:url';

const IMAGE_FOLDER_PATH = './images';

console.log('import.meta.url:', import.meta.url);
console.log('fileURLToPath(import.meta.url):', fileURLToPath(import.meta.url));
console.log('path.dirname(fileURLToPath(import.meta.url)):', path.dirname(fileURLToPath(import.meta.url)));
const dirName = path.dirname(fileURLToPath(import.meta.url))
console.log(path.resolve(dirName, IMAGE_FOLDER_PATH, 'abbc.jpg'))