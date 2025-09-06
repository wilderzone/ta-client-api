type ChildProcessEventHandler<T, A = Array<any>> = (event: T, callback: (args: A) => void) => void;
type ChildProcessEvent = 'data' | 'exit';

export interface ChildProcess {
	/** Indicates whether it is still possible to send/receive messages to/from the child process. */
	connected: boolean;
	/** The PID of the child process. */
	pid: number | undefined;
	/** Listen to events emitted by the child process. */
	on: ChildProcessEventHandler<ChildProcessEvent, string>;
	/** Start the child process. */
	start: () => Promise<void>;
	/** Stop the child process. */
	stop: () => Promise<void>;
}

export interface RuntimeAdapter {
	process: {
		/** Create a new child process. */
		spawn: (command: string, args?: string[]) => ChildProcess;
	}
}
