import { BaseItem } from "./base.item";

export class Actor extends BaseItem {
	constructor(x, y) {
		super(x, y, Actor.name);
	}
}
