import { Cell } from "./items/cell.item";
import { Indicator } from "./items/indicator.item";

export const EVENT = {
	moves: "_moves",
	level: "_level",
	time: "_time",
	score: "_score",
	end: "_end",
};

export class Board {
	#size = 0;

	#grid;
	#timer;

	#state = {};
	#score = 0;
	#time = 0;
	#moves = 0;
	#level = 0;

	#callbacks = {
		seq: 0,
		...Object.values(EVENT).reduce((obj, event) => ({ ...obj, [event]: {} }), {}),
	};

	setGrid(grid) {
		this.#grid = grid;
	}

	placeIndicator(x, y, dir) {
		const cell = this.#state[x][y];

		if (!cell) {
			return;
		}

		if (!this.getMoves()) {
			return;
		}

		for (const el of cell.elem.querySelectorAll("div")) {
			if (el.classList.contains("Indicator") || el.tagName === "DIV") {
				el.remove();
			}
		}

		const indicator = new Indicator(x, y, dir);

		cell.elem.addEventListener(
			"dblclick",
			() => {
				indicator.elem.remove();
			},
			{ once: true },
		);

		cell.elem.addEventListener("touchend", (e) => {
			const currentTime = Date.now();
			const tapLength = currentTime - this.lastTap;

			if (tapLength < 500 && tapLength > 0) {
				e.preventDefault();
				indicator.elem.remove();
			} else {
				this.isPinching = false;
			}
			this.lastTap = currentTime;
		});

		cell.elem.appendChild(indicator.elem);
		this.nextMove();
	}

	init() {
		this.#grid.style.setProperty("--grid-size", this.#size);

		for (let x = 0; x < this.#size; x++) {
			if (!this.#state[x]) {
				this.#state[x] = {};
			}

			for (let y = 0; y < this.#size; y++) {
				if (!this.#state[x][y]) {
					this.#state[x][y] = {};
				}

				const cell = new Cell(x, y);

				cell.elem.dataset.x = x;
				cell.elem.dataset.y = y;
				cell.elem.classList.add("grid-cell");

				cell.elem.addEventListener("dragover", (e) => {
					e.preventDefault();
					cell.elem.classList.add("drag-over");
				});

				cell.elem.addEventListener("dragleave", (e) => {
					e.preventDefault();
					cell.elem.classList.remove("drag-over");
				});

				cell.elem.addEventListener("drop", (e) => {
					e.preventDefault();
					cell.elem.classList.remove("drag-over");
					this.placeIndicator(x, y, e.dataTransfer.getData("text/plain"));
				});

				this.#state[x][y] = cell;
				this.#grid.appendChild(cell.elem);
			}
		}
	}

	getSize() {
		return this.#size;
	}

	setSize(size) {
		return (this.#size = size);
	}

	getMoves() {
		return this.#moves;
	}

	setMoves(moves) {
		return (this.#moves = moves);
	}

	nextMove() {
		this.#moves--;
		this.eventEmit(EVENT.moves, this.#moves);
	}

	getLevel() {
		return this.#level;
	}

	setLevel(level) {
		this.#level = level;
		this.eventEmit(EVENT.level, this.#level);
	}

	getTime() {
		return this.#time;
	}

	setTime(time) {
		return (this.#time = time);
	}

	getScore() {
		return this.#score;
	}

	setScore(score) {
		this.eventEmit(EVENT.score, score);
		return (this.#score = score);
	}

	getCell(x, y) {
		return this.#state[x][y].elem.querySelector("div");
	}

	timerStart() {
		this.#timer = () => {
			if (this.#time <= 0) {
				this.eventEmit(EVENT.end, {});
				return;
			}

			this.#time--;
			this.eventEmit(EVENT.time, this.#time);

			if (this.#timer) setTimeout(this.#timer, 1000);
		};

		this.#timer();
	}

	timerReset() {
		this.#time = 0;
	}

	timerStop() {
		this.#timer = undefined;
	}

	eventSubscribe(event, callback) {
		const seq = this.#callbacks.seq + 1;

		const r = {
			unsubscribe: () => {
				delete this.#callbacks[event][seq];
			},
		};

		this.#callbacks[event][seq] = (data) => {
			callback({ ...r, data });
		};

		this.#callbacks.seq = seq;

		return r;
	}

	eventEmit(event, data) {
		Object.values(this.#callbacks[event]).forEach((callback) => {
			callback(data);
		});
	}

	eventEmitAll() {
		this.eventEmit(EVENT.level, this.#level);
		this.eventEmit(EVENT.moves, this.#moves);
		this.eventEmit(EVENT.time, this.#time);
		this.eventEmit(EVENT.score, this.#score);
	}

	boardReset() {
		this.#grid.innerHTML = "";
		this.#state = {};
	}

	itemCreate(x, y, Item) {
		const cell = this.#state[x][y];

		const item = new Item(x, y);
		cell.elem.appendChild(item.elem);

		return item;
	}

	itemMove(x, y, item) {
		const oldPos = item.pos;

		const cell = this.#state[x][y];

		cell.elem.appendChild(item.elem);
		item.pos = { x, y };

		this.#state[oldPos.x][oldPos.y].innerHTML = "";
	}

	itemDelete(item) {
		const { x, y } = item.pos;

		this.#state[x][y].innerHTML = "";
		item.remove();
	}
}
