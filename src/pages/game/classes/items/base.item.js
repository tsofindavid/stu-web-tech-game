export class BaseItem {
	_elem = null;
	_content = null;
	_html = null;
	_x = 0;
	_y = 0;
	_dataset = [];
	_className;

	get elem() {
		return this._elem;
	}

	get content() {
		return this._content;
	}

	get html() {
		return this._html;
	}

	get dataset() {
		return this._dataset;
	}

	get pos() {
		return {
			x: this._x,
			y: this._y,
		};
	}

	set pos({ x, y }) {
		this._x = x;
		this._y = y;
	}

	constructor(x, y, className) {
		this._elem = document.createElement("div");

		this._x = x;
		this._y = y;

		this._className = className;

		this._dataset = [
			["x", this._x],
			["y", this._y],
		];

		this.upsert();
	}

	upsert() {
		this._elem.className = this._className;

		for (const [k, v] of this.dataset) {
			this._elem.dataset[k] = v;
		}

		if (this._content) {
			this._elem.textContent = this._content;
		}

		if (this._html) {
			this._elem.innerHTML = this._html;
		}

		return this;
	}
}
