import { mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path/posix';
import { GameClient } from '../dist/index.js';

const exe = 'C:/Program Files/Tribes_Ascend_Parting_Gifts/Binaries/Win32/TribesAscend.exe';
const map = 'TrCTFBlitz-BellaOmega';
const log = 'C:/Users/gigab/Documents/GitHub/ta-client-api/tests/logs';

export const candidate = () => {
	// Clear the logs directory.
	rmSync(log, { recursive: true });
	mkdirSync(log);
	// Launch the game.
	return new Promise((resolve) => {
		const client = new GameClient(exe);
		client
			.splash(false)
			.windowed(true)
			.resolution(700, 450)
			.map(map)
			.log(log)
			.on('start', () => {
				setTimeout(() => {
					client.stop();
				}, 5000);
			})
			.on('stop', resolve)
			.on('crash', resolve)
			.start();
	});
};

export const validator = () => {
	// Read the log file to check the correct map was launched.
	try {
		const directory = readdirSync(log, { encoding: 'utf-8', withFileTypes: true });
		if (directory.length !== 1) return false;
		const content = readFileSync(join(log, directory[0].name), { encoding: 'utf-8' });
		return content.includes(`Bringing World ${map}.TheWorld up for play`);
	} catch (error) {
		console.warn(error);
		return false;
	}
};
