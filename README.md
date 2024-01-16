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

Or to connect directly to a game server:

```js
import { Team } from 'ta-client-api';

client
    .connect('example.wilderzone.live', 7777)  // Specify the server address and port to connect to.
    .team(Team.DiamondSword)                   // Join the Diamond Sword team.
    .start();                                  // Launch the game.
```

All available settings:
| Setting      | Options              | Default            | Works with <br> (🕹️ game mode \| 🗄️ server mode) | Description                                           |
| :----------- | :------------------- | :----------------- | :---------- | :---------------------------------------------------- |
| `custom`     | `argument`           | *None*             | 🕹️🗄️        | Pass a custom argument to the game client.            |
| `connect`    | `address`, `port-number` | *None*, `7777` | 🕹️          | Connect to a game server.                             |
| `debug`      | `true \| false`      | `false`            | 🕹️🗄️        | Enable debugging output.                              |
| `fullscreen` | `true \| false`      | `true`             | 🕹️          | Enable fullscreen mode.                               |
| `host`       | `address`            | *None*             | 🕹️🗄️        | Use a specific host login server.                     |
| `log`        | `path`               | `{cwd}/logs`       | 🕹️🗄️        | Output log files.                                     |
| `map`        | `map-name`           | *None*             | 🕹️🗄️        | Launch directly into a particular map.                |
| `position`   | `number`, `number`   | `0`, `0`           | 🕹️          | The position of the game window on the screen. This only takes effect in windowed mode. |
| `resolution` | `number`, `number`   | *None*             | 🕹️          | The resolution of the game window.                    |
| `server`     | `port-number`        | `7777`             | 🗄️          | Start the game as a server.                           |
| `splash`     | `true \| false`      | `true`             | 🕹️          | Show the splash screen.                               |
| `team`       | `0 \| 1 \| 2 \| 255` | `255`              | 🕹️          | The team to join.                                     |
| `windowed`   | `true \| false`      | `false`            | 🕹️          | Enable windowed mode.                                 |


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
