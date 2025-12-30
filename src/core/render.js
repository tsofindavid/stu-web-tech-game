export function render(node) {
	const app = document.getElementById("app");
	app.innerHTML = "";
	app.append(node);
}
