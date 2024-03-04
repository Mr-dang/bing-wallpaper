import path from 'node:path';
import { fileURLToPath } from 'node:url';
import BingWallpaperService from './services/BingWallpaperService.mjs';

process.env.ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));

const filePath = path.resolve(process.env.ROOT_DIR, 'images');

const executor = (new BingWallpaperService(filePath)).execute;

executor();