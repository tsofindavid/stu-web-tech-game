import { EVENT } from "./board";
import { Actor } from "./items/actor.item";
import { End } from "./items/end.item";
import { DIRECTION, Indicator } from "./items/indicator.item";
import { Mountain } from "./items/mountain.item";
import { Start } from "./items/start.item";

export class Game {
	#board;

	#levels;
	#level;

	#dir;
	#actor;

	#loop;
	#end;

	calculateScore() {
		let score = this.#board.getScore();
		score += this.#board.getTime() * 10;
		score += this.#board.getMoves() * 50;
		score += this.#board.getSize() * 20;

		this.#board.setScore(score);
	}

	setBoard(b) {
		this.#board = b;
	}

	setLevels(l) {
		this.#levels = l;
	}

	configure() {
		this.#board.boardReset();
		this.#board.setSize(this.#level.size);
		this.#board.setTime(this.#level.time);
		this.#board.setMoves(this.#level.moves);
		this.#board.init();

		this.#dir = this.#level.dir;

		this.#actor = this.#board.itemCreate(this.#level.start.x, this.#level.start.y, Actor);

		this.#board.itemCreate(this.#level.start.x, this.#level.start.y, Start);
		this.#board.itemCreate(this.#level.end.x, this.#level.end.y, End);

		for (const { x, y } of this.#level.mountains) {
			this.#board.itemCreate(x, y, Mountain);
		}

		this.#board.eventEmitAll();
	}

	nextLevel() {
		this.calculateScore();
		const level = this.#board.getLevel() + 1;

		this.#board.setLevel(level);
		this.#level = this.#levels[level];

		if (!this.#level) {
			this.stop();
		}

		this.configure();
	}

	step() {
		let x = this.#actor.pos.x;
		let y = this.#actor.pos.y;

		if (this.#dir === DIRECTION.right) {
			y = this.#actor.pos.y + 1;
		}

		if (this.#dir === DIRECTION.left) {
			y = this.#actor.pos.y - 1;
		}

		if (this.#dir === DIRECTION.down) {
			x = this.#actor.pos.x + 1;
		}

		if (this.#dir === DIRECTION.up) {
			x = this.#actor.pos.x - 1;
		}

		const size = this.#board.getSize();

		if (x >= size || y >= size || x < 0 || y < 0) {
			this.#dir = this.#level.dir;
			x = this.#level.start.x;
			y = this.#level.start.y;
		}

		const cell = this.#board.getCell(x, y);
		if (cell) {
			if (cell.className === Indicator.name) {
				this.#dir = cell.getAttribute("data-dir");
			}

			if (cell.className === Mountain.name) {
				this.#dir = this.#level.dir;
				x = this.#level.start.x;
				y = this.#level.start.y;
			}

			if (cell.className === End.name) {
				return this.nextLevel();
			}
		}

		this.#board.itemMove(x, y, this.#actor);
	}

	start() {
		this.#level = this.#levels[this.#board.getLevel()];
		this.configure();

		this.#loop = this.#board.eventSubscribe(EVENT.time, () => {
			this.step();
		});

		this.#end = this.#board.eventSubscribe(EVENT.end, () => {
			this.stop();
		});

		this.#board.timerStart();
	}

	stop() {
		this.#loop.unsubscribe();
		this.#end.unsubscribe();

		this.#board.timerStop();
		this.#board.eventEmit(EVENT.end, {
			moves: this.#board.getMoves(),
			time: this.#board.getTime(),
		});
	}
}
