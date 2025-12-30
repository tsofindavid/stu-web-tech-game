export function useStyle(css) {
	const styleEl = document.createElement("style");
	styleEl.textContent = css;

	document.head.appendChild(styleEl);

	return {
		cleanUp: () => {
			styleEl.remove();
		},
	};
}
