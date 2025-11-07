const BOARD_SIZE = 8;

const EVENT = {
  direction: "_direction",
  time: "_time",
};

class Board {
  #grid;
  #state = {};

  #timer;
  #time = 0;

  #callbacks = {
    seq: 0,
    ...Object.values(EVENT).reduce(
      (obj, event) => ({ ...obj, [event]: {} }),
      {},
    ),
  };

  constructor(grid) {
    this.#grid = grid;
    this.#init();
  }

  #init() {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (!this.#state[x]) {
        this.#state[x] = {};
      }

      for (let y = 0; y < BOARD_SIZE; y++) {
        if (!this.#state[x][y]) {
          this.#state[x][y] = {};
        }

        const cell = new Cell(x, y);

        cell.elem.addEventListener("dragover", (e) => {
          e.preventDefault();
          cell.elem.classList.add("drag-over");
        });

        cell.elem.addEventListener("dragleave", () => {
          cell.elem.classList.remove("drag-over");
        });

        cell.elem.addEventListener("drop", (e) => {
          e.preventDefault();
          cell.elem.classList.remove("drag-over");

          const dir = e.dataTransfer.getData("text/plain");

          for (const e of cell.elem.querySelectorAll("div")) {
            if (e.className !== "indicator") {
              return;
            } else {
              e.remove();
            }
          }

          const indicator = new Indicator(x, y, dir);
          indicator.elem.addEventListener("dblclick", () => {
            indicator.elem.remove();
          });

          cell.elem.appendChild(indicator.elem);

          Object.values(this.#callbacks[EVENT.direction]).forEach((callaback) =>
            callaback(direction),
          );
        });

        this.#state[x][y] = cell;
        this.#grid.appendChild(cell.elem);
      }
    }
  }

  startTimer() {
    this.#timer = setInterval(() => {
      this.#time++;
      Object.values(this.#callbacks[EVENT.time]).forEach((callaback) =>
        callaback(this.#time),
      );
    }, 1000);
  }

  resetTimer() {
    this.#time = 0;
  }

  stopTimer() {
    this.#timer?.close();
  }

  subscribe(event, callback) {
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

  reset() {
    this.#grid.innerHTML = "";
    this.#state = {};

    this.#init();
  }

  createItem(x, y, Item) {
    const cell = this.#state[x][y];

    if (cell.elem.querySelector("div")) {
      return;
    }

    const item = new Item(x, y);
    cell.elem.appendChild(item.elem);

    return item;
  }

  moveItem(x, y, item) {
    const oldPos = item.pos;

    const cell = this.#state[x][y];

    if (cell.elem.querySelector("div")) {
      return;
    }

    cell.elem.appendChild(item.elem);
    item.pos = { x, y };

    this.#state[oldPos.x][oldPos.y].innerHTML = "";
  }

  deleteItem(item) {
    const { x, y } = item.pos;

    this.#state[x][y].innerHTML = "";
    item.remove();
  }

  // initializeLevel(levelConfig) {}

  // placeActor(position, direction) {}
  // moveActor() {}
  // getActorInfo() {}

  // setStart(position) {}
  // setFinish(position) {}
  // addMountain(position) {}
  // removeMountain(position) {}
  // setDirection(position, direction) {}
  // removeDirection(position) {}

  // getCellInfo(position) {}
  // isValidPosition(position) {}
  // isMovable(position) {}

  // validateMove(position) {}
  // checkWinCondition() {}
  // checkLoseCondition() {}

  // serialize() {}
  // deserialize(data) {}
}
