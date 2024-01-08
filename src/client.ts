import { spawn, type ChildProcess } from 'node:child_process';
import { Config, Defaults } from './config.js';
import { createLaunchCommand } from './command.js';

export class GameClient {
	#config: Config;
	#client?: ChildProcess;

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
	 * Set the game to run in fullscreen mode.
	 * @param fullscreen Set `true` *(default)* to run fullscreen, `false` to run in windowed mode.
	 */
	public fullscreen (fullscreen = Defaults.fullscreen): GameClient {
		this.#config.fullscreen = fullscreen;
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
	 * Set the visibility of the splash screen.
	 * @param show Set `true` *(default)* to show the splash, `false` to hide it.
	 */
	public splash (show = Defaults.showSplash): GameClient {
		this.#config.showSplash = show;
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
	 * Start the game client.
	 */
	public start (): void {
		if (this.#client && this.#client.connected) {
			console.info('The game client is already running.');
			return;
		}
		console.info('Starting game client...');
		const { path, args } = createLaunchCommand(this.#config);
		this.#client = spawn(path, args);
		this.#client.on('spawn', () => {
			console.info('Success.');
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
		this.#client.on('exit', () => {
			this.#client = undefined;
			console.info('Success.');
		});
		this.#client.kill();
	}
}
