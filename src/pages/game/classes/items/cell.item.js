import { BaseItem } from "./base.item";

export class Cell extends BaseItem {
	constructor(x, y) {
		super(x, y, Cell.name);
	}
}
