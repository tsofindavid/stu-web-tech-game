export function h(type, props, ...children) {
	if (type === Fragment) {
		return children;
	}

	const el = document.createElement(type);

	for (const [key, value] of Object.entries(props || {})) {
		if (key === "ref" && typeof value === "function") {
			value(el);
		} else if (key.startsWith("on")) {
			el.addEventListener(key.slice(2).toLowerCase(), value);
		} else {
			el.setAttribute(key, value);
		}
	}

	children.flat().forEach((child) => {
		if (child == null) return;
		el.append(child instanceof Node ? child : document.createTextNode(child));
	});

	return el;
}

export function Fragment(_, ...children) {
	return children;
}
