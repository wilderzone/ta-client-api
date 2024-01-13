import test, { FailureLogSeverity } from 'micro-test-runner';
import * as map from './map.test.js';

const tests = [
	{ name: 'Map', candidate: map.candidate, validator: map.validator }
];

async function main () {
	for (const { name, candidate, validator } of tests) {
		let result = await test(candidate)
			.async()
			.logging(name, FailureLogSeverity.ERROR)
			.expect([validator]);
		if (!result) break;
	}
}

main();
