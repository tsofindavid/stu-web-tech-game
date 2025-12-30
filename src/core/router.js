import { runEffects } from "./hooks.js";
import { render } from "./render.js";

export function navigate(page) {
	location.hash = page;
}

export function initRouter(routes, home = "") {
	function update() {
		const page = location.hash.slice(1) || home;
		render(routes[page]());
		runEffects();
	}

	window.addEventListener("hashchange", update);
	update();
}
