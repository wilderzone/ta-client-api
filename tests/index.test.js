import test, { FailureLogSeverity } from 'micro-test-runner';

const tests = [
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
