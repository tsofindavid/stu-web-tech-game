export function useState(initial) {
	let value = initial;
	const subscribers = new Set();

	return {
		get: () => value,
		set: (newValue) => {
			value = newValue;
			subscribers.forEach((fn) => {
				fn(value);
			});
		},
		subscribe: (fn) => {
			subscribers.add(fn);
			fn(value);
			return () => subscribers.delete(fn);
		},
	};
}
