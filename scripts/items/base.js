class BaseItem {
  _elem = null;
  _content = null;
  _html = null;
  _x = 0;
  _y = 0;
  _className;

  constructor(x, y, className, options = {}) {
    this._elem = document.createElement("div");

    this._x = x;
    this._y = y;

    this._className = className;

    if (options.content) {
      this._content = options.content;
    }

    if (options.html) {
      this._html = options.html;
    }

    this.upsert();
  }

  get elem() {
    return this._elem;
  }

  get dataset() {
    return [
      ["x", this._x],
      ["y", this._y],
    ];
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

  get html() {
    return this._html;
  }

  get content() {
    return this._content;
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
