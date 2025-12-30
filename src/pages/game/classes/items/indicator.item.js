import { BaseItem } from "./base.item";

export const DIRECTION = {
	up: "up",
	down: "down",
	left: "left",
	right: "right",
};

export const DIRECTION_CONTENT = {
	[DIRECTION.up]: "↑",
	[DIRECTION.down]: "↓",
	[DIRECTION.left]: "←",
	[DIRECTION.right]: "→",
};

export class Indicator extends BaseItem {
	constructor(x, y, dir) {
		super(x, y, Indicator.name);

		this._content = DIRECTION_CONTENT[dir];
		this._dataset.push(["dir", dir]);

		this.upsert();
	}
}
