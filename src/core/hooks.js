let effects = [];
let cleanUps = [];

export function useEffect(fn) {
	effects.push(fn);
}

export function runEffects() {
	effects.forEach((fn) => {
		cleanUps.forEach((cleanUp) => {
			cleanUp();
		});
		cleanUps = [];

		const cleanUp = fn();
		if (cleanUp) {
			cleanUps.push(cleanUp);
		}
	});
	effects = [];
}
