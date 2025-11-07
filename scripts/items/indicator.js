const DIRECTION = {
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
};

class Indicator extends BaseItem {
  _dir;

  constructor(x, y, dir) {
    super(x, y, "indicator", {
      content: DIRECTION[dir],
    });

    this._dir = dir;
  }

  // overwrite
  get dataset() {
    return [
      ["x", this._x],
      ["y", this._y],
      ["dir", this._dir],
    ];
  }

  get dir() {
    return this._dir;
  }
}
