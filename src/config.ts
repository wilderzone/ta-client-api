import { join } from 'node:path/posix';
import type { maps } from './maps.js';

/**
 * Game client configuration.
 */
export class Config {
	fullscreen = true;
	logPath = join(process.cwd(), 'logs');
	map?: (typeof maps)[number];
	position = {
		x: 0,
		y: 0
	};
	path: string;
	resolution = {
		x: 1920,
		y: 1080
	};
	showSplash = true;
	windowed = false;

	constructor (path = 'TribesAscend.exe') {
		this.path = path;
	}
}

/**
 * Default game client configuration.
 */
export const Defaults = new Config();
