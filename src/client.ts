import { spawn, type ChildProcess } from 'node:child_process';
import { Config, Defaults } from './config.js';
import { createLaunchCommand } from './command.js';

type GameClientEvent = 'start' | 'stop';
type GameClientEventListener = () => (void | Promise<void>);

export class GameClient {
	#config: Config;
	#client?: ChildProcess;
	#listeners: Record<GameClientEvent, Array<GameClientEventListener>> = {
		start: [],
		stop: []
	};

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
	 * Register a callback function with a particular game client event.
	 * @param event The event to listen for.
	 * @param callback A function to call when the event is triggered.
	 */
	public on (event: GameClientEvent, callback: GameClientEventListener): GameClient {
		this.#listeners[event].push(callback);
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
		this.#client = spawn(path, args);
		// Watch the stdout stream for the "ready" message.
		this.#client.stdout?.on('data', (data: Buffer) => {
			const line = data.toString();
			if (
				line.includes('Warning, Failed to compile Material dev_efx_elechold.MAT_EFX_DEV_SubUV_bolts')
				|| line.includes('Warning, Failed to load \'Font None.ITC Franklin Gothic Std Med\'')
			) {
				console.info('\x1b[32m•\x1b[0m Started');
				for (const callback of this.#listeners.start) callback();
			}
		});
		// Listen for the client's exit event.
		this.#client.on('exit', () => {
			this.#client = undefined;
			console.info('\x1b[31m•\x1b[0m Stopped');
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
		this.#client.kill();
	}
}
