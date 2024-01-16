import { join } from 'node:path/posix';
import type { maps } from './maps.js';
import { Team } from './teams.js';

/**
 * Game client configuration.
 */
export class Config {
	custom = new Array<string>();
	fullscreen = true;
	host?: string;
	log = false;
	logPath = join(process.cwd(), 'logs');
	map?: (typeof maps)[number];
	position = {
		x: 0,
		y: 0
	};
	path: string;
	remoteAddress?: string;
	remotePort = 7777;
	resolution = {
		x: 1920,
		y: 1080
	};
	server = false;
	serverPort = 7777;
	showSplash = true;
	team = Team.Spectator;
	windowed = false;

	constructor (path = 'TribesAscend.exe') {
		this.path = path;
	}
}

/**
 * Default game client configuration.
 */
export const Defaults = new Config();
