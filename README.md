# <img src="./logo.svg" style="width: 3em;"> TA Client API

[![npm version](https://badge.fury.io/js/ta-client-api.svg)](https://www.npmjs.com/package/ta-client-api)

Control TA programmatically with JavaScript.

```sh
npm install ta-client-api
```

## Usage

```js
import { GameClient } from 'ta-client-api';

// The path to your TA executable (can be relative or absolute).
const path = 'C:/path/to/TribesAscend.exe';

// Create a new game client instance.
const client = new GameClient(path);
```

### Configuration

The easiest way to configure the client is through the chainable settings methods.
Each method is optional and can be used in any order. For example, to launch the game in a 700px ⨯ 450px window: 

```js
client
    .windowed(true)           // Enable windowed mode.
    .resolution(700, 450)     // Set the resolution.
    .start();                 // Launch the game.
```

All available settings:
| Setting      | Options            | Default            | Description                                           |
| :----------- | :----------------- | :----------------- | :---------------------------------------------------- |
| `debug`      | `true \| false`    | `false`            | Enable debugging output.                              |
| `fullscreen` | `true \| false`    | `true`             | Enable fullscreen mode.                               |
| `log`        | `path`             | `{cwd}/logs`       | Output log files.                                     |
| `map`        | `map-name`         | *None*             | Launch directly into a particular map.                |
| `position`   | `number`, `number` | `0`, `0`           | The position of the game window on the screen. This only takes effect in windowed mode. |
| `resolution` | `number`, `number` | *None*             | The resolution of the game window.                    |
| `server`     | `port-number`      | `7777`             | Start the game as a server.                           |
| `splash`     | `true \| false`    | `true`             | Show the splash screen.                               |
| `windowed`   | `true \| false`    | `false`            | Enable windowed mode.                                 |


### Events

You can register callback functions to listen for certain events emitted by the game client.  
For example, to log a message when the client starts:
```js
client.on('start', () => {
    console.log('Woohoo!');
});
```

| Event   | Description                                                                     |
| :------ | :------------------------------------------------------------------------------ |
| `start` | Emitted when the game client has started up and is ready to be interacted with. |
| `stop`  | Emitted when the game client has stopped running (intentionally) and is no longer accessible. |
| `crash` | Emitted when the game client has stopped running (from a crash) and is no longer accessible. |


## References

- [UE3 commandline parameters](https://docs.unrealengine.com/udk/Three/CommandLineArguments.html)
