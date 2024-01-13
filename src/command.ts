import { join } from 'node:path/posix';
import type { Config } from './config.js';
import { maps } from './maps.js';

interface LaunchCommand {
	path: string;
	args: Array<string>;
}

export function createLaunchCommand (config: Config): LaunchCommand {
	const command: LaunchCommand = {
		path: config.path || 'TribesAscend.exe',
		args: new Array<string>()
	};

	const windowed = config.windowed || !config.fullscreen;

	// Server.
	if (config.server) {
		command.args.push('server');
	}

	// Map.
	// Must be the first argument (or first after 'server').
	if (config.map && maps.includes(config.map)) {
		let map = config.map;
		if (!config.server && typeof config.team === 'number' && !isNaN(config.team)) {
			map += `?TEAM=${config.team}`;
		}
		command.args.push(map);
	}

	// Server port.
	if (config.server) {
		command.args.push(`-port=${config.serverPort}`);
	}

	// Logs.
	if (config.log && config.logPath) {
		const time = new Date().toISOString().split(':').join('-');
		const logPath = join(config.logPath, `${time}.log`).split('\\').join('/');
		command.args.push(`-abslog="${logPath}"`);
	} else {
		command.args.push('-nowrite');
	}

	// Splash.
	if (!config.showSplash) {
		command.args.push('-nosplash');
	}

	// Fullscreen / Windowed.
	if (windowed) {
		command.args.push('-windowed');
	} else {
		command.args.push('-fullscreen');
	}

	// Position.
	if (windowed && typeof config.position.x === 'number') {
		command.args.push(`-posx=${config.position.x}`);
	}
	if (windowed && typeof config.position.y === 'number') {
		command.args.push(`-posy=${config.position.y}`);
	}

	// Resolution.
	if (typeof config.resolution.x === 'number') {
		command.args.push(`-resx=${config.resolution.x}`);
	}
	if (typeof config.resolution.y === 'number') {
		command.args.push(`-resy=${config.resolution.y}`);
	}

	return command;
}
