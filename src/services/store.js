const STORE_KEY = "redirect.store";

export class LocalStorage {
	#store = {};

	constructor() {
		const item = localStorage.getItem(STORE_KEY);
		if (!item) {
			return;
		}

		this.#store = JSON.parse(item);
	}

	set(key, value) {
		this.#store[key] = value;
	}

	get(key) {
		return this.#store[key];
	}

	delete(key) {
		delete this.#store[key];
	}

	clean() {
		this.#store = {};
	}

	save() {
		localStorage.setItem(STORE_KEY, JSON.stringify(this.#store));
	}
}

export const store = new LocalStorage();
