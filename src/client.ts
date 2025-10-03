import { spawn, type ChildProcess } from 'node:child_process';
import { Config, Defaults } from './config.js';
import { createLaunchCommand } from './command.js';
import type { maps } from './maps.js';
import { strings } from './strings.js';
import { Team } from './teams.js';

type GameClientEvent = 'crash' | 'start' | 'stop';
type GameClientEventListener = () => (void | Promise<void>);

export class GameClient {
	#config: Config;
	#client?: ChildProcess;
	#debug = false;
	#listeners: Record<GameClientEvent, Array<GameClientEventListener>> = {
		crash: [],
		start: [],
		stop: []
	};
	#running = false;

	constructor (config?: Config)
	constructor (path?: string)
	constructor (config?: string | Config) {
		if (config instanceof Config) {
			this.#config = config;
			return;
		}
		this.#config = new Config(config);
	}

	/**
	 * The assigned path to the game executable.
	 */
	public get path (): string {
		return this.#config.path;
	}

	/**
	 * Connect to a game server.
	 * @param address The address of the server to connect to.
	 * @param port The port of the server.
	 */
	public connect (address: string, port = Defaults.remotePort): GameClient {
		this.#config.remoteAddress = address;
		this.#config.remotePort = port;
		return this;
	}

	/**
	 * Pass a custom argument to the game client.
	 * This can be called more than once to pass multiple arguments.
	 * @param argument The argument to pass.
	 * @returns 
	 */
	public custom (argument: string): GameClient {
		this.#config.custom.push(argument);
		return this;
	}

	/**
	 * Enable debugging output.
	 * @param enable Set `true` *(default)* to enable debug output, `false` to disable.
	 */
	public debug (enable = true): GameClient {
		this.#debug = enable;
		return this;
	}

	/**
	 * Set the game to run in fullscreen mode.
	 * @param fullscreen Set `true` *(default)* to run fullscreen, `false` to run in windowed mode.
	 */
	public fullscreen (fullscreen = Defaults.fullscreen): GameClient {
		this.#config.fullscreen = fullscreen;
		return this;
	}

	/**
	 * Use a specific host login server.
	 * @param address The address of the login server.
	 */
	public host (address: string): GameClient {
		this.#config.host = address;
		return this;
	}

	/**
	 * Output log files.
	 * @param path The directory the client should output log files to. *(defaults to `{cwd}/logs`)*.
	 */
	public log (path = Defaults.logPath): GameClient {
		this.#config.log = true;
		this.#config.logPath = path;
		return this;
	}

	/**
	 * Launch directly into a particular map.
	 * @param map The full name of the map (eg, `'TrCTF-Katabatic'`).
	 */
	public map (map: (typeof maps)[number]): GameClient {
		this.#config.map = map;
		return this;
	}

	/**
	 * Set the position of the game window on the screen (in pixels).
	 * This only takes effect in windowed mode.
	 * @param x The horizontal position.
	 * @param y The vertical position.
	 */
	public position (x = Defaults.position.x, y = Defaults.position.y): GameClient {
		this.#config.position.x = x;
		this.#config.position.y = y;
		return this;
	}

	/**
	 * Set the resolution of the game window (in pixels).
	 * @param width The horizontal resolution.
	 * @param height The vertical resolution.
	 */
	public resolution (width = Defaults.resolution.x, height = Defaults.resolution.y): GameClient {
		this.#config.resolution.x = width;
		this.#config.resolution.y = height;
		return this;
	}

	/**
	 * Start the game as a server.
	 * @param port The port to open the server on *(defaults to `7777`)*.
	 */
	public server (port = Defaults.serverPort): GameClient {
		this.#config.server = true;
		this.#config.serverPort = port;
		return this;
	}

	/**
	 * Set the visibility of the splash screen.
	 * @param show Set `true` *(default)* to show the splash, `false` to hide it.
	 */
	public splash (show = Defaults.showSplash): GameClient {
		this.#config.showSplash = show;
		return this;
	}

	/**
	 * Set the team to join.
	 * @param team The team to join.
	 * - `0` = None
	 * - `1` = Diamond Sword
	 * - `2` = Blood Eagle
	 * - `255` = Spectator
	 */
	public team (team: Team): GameClient {
		this.#config.team = team;
		return this;
	}

	/**
	 * Set the game to run in windowed mode (with title bar).
	 * @param window Set `true` to run windowed, `false` *(default)* to run in fullscreen mode.
	 */
	public windowed (window = Defaults.windowed): GameClient {
		this.#config.windowed = window;
		return this;
	}

	/**
	 * Register a callback function with a particular game client event.
	 * @param event The event to listen for.
	 * @param callback A function to call when the event is triggered.
	 */
	public on (event: GameClientEvent, callback: GameClientEventListener): GameClient {
		this.#listeners[event].push(callback);
		return this;
	}

	/**
	 * Unregister an existing callback function from a particular game client event.
	 * @param event The event.
	 * @param callback The function to unregister.
	 */
	public off (event: GameClientEvent, callback: GameClientEventListener): GameClient {
		const index = this.#listeners[event].indexOf(callback);
		if (index >= 0) this.#listeners[event].splice(index, 1);
		return this;
	}

	/**
	 * Start the game client.
	 */
	public start (): void {
		if (this.#client && this.#client.connected) {
			console.info('The game client is already running.');
			return;
		}
		// Start the client.
		console.info('Starting game client...');
		const { path, args } = createLaunchCommand(this.#config);
		const cwd = path.split('/').slice(0, -1).join('/');
		if (this.#debug) {
			console.info('Path:', path);
			console.info('CWD:', cwd);
			console.info('Arguments:', args);
		}
		this.#client = spawn(path, args, { argv0: '', cwd, windowsVerbatimArguments: true });
		this.#running = true;
		// Watch the stdout stream for the "ready" message.
		this.#client.stdout?.on('data', (data: Buffer) => {
			const line = data.toString();
			if (this.#debug) process.stdout.write(`\x1b[2m>\x1b[0m ${line}`);
			if (
				line.includes(strings.materialCompilationWarning)
				|| line.includes(strings.fontLoadWarning)
			) {
				console.info('\x1b[32m•\x1b[0m Started');
				for (const callback of this.#listeners.start) callback();
			}
		});
		// Listen for the client's exit event.
		this.#client.on('exit', () => {
			this.#client = undefined;
			if (this.#running) {
				console.warn('\x1b[31m!\x1b[0m Crashed');
				for (const callback of this.#listeners.crash) callback();
			} else {
				console.info('\x1b[31m•\x1b[0m Stopped');
				for (const callback of this.#listeners.stop) callback();
			}
			this.#running = false;
		});
	}

	/**
	 * Stop the game client.
	 */
	public stop (): void {
		if (!this.#client || this.#client.killed) {
			console.info('The game client is not running.');
			return;
		}
		console.info('Stopping game client...');
		this.#running = false;
		this.#client.kill();
	}
}
