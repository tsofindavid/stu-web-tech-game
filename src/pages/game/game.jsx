/** @jsx h */
/** @jsxFrag Fragment */

import { Fragment, h, useEffect, useState, useStyle } from "@/core";
import { store } from "@/services/store.js";
import { navigate } from "../../core/router.js";
import { Board, EVENT } from "./classes/board.js";
import { Game } from "./classes/game.js";
import { generateLevels } from "@/services/levelGenerator.js";
import styles from "./game.css?inline";

const level = useState(0);
const moves = useState(0);
const time = useState(0);
const score = useState(0);

export function GamePage() {
    let levelEl, timeEl, movesEl, scoreEl, gridEl;

    let onPause = false;

    const game = new Game();
    const board = new Board();

    const initState = () => {
        level.subscribe((value) => {
            if (levelEl) levelEl.textContent = value;
        });

        moves.subscribe((value) => {
            if (movesEl) movesEl.textContent = value;
        });

        time.subscribe((value) => {
            if (timeEl) timeEl.textContent = value;
        });

        score.subscribe((value) => {
            if (scoreEl) scoreEl.textContent = value;
        });
    };

    const initDragDrop = () => {
        document.querySelectorAll(".tool").forEach((tool) => {
            tool.addEventListener("dragstart", function (e) {
                e.dataTransfer.setData("text/plain", this.dataset.direction);
                this.classList.add("dragging");
            });

            tool.addEventListener("dragend", function () {
                this.classList.remove("dragging");
            });

            tool.addEventListener(
                "touchstart",
                function (e) {
                    const touch = e.touches[0];

                    const clone = this.cloneNode(true);
                    clone.classList.add("dragging-clone");

                    clone.style.position = "fixed";
                    clone.style.left = `${touch.clientX}px`;
                    clone.style.top = `${touch.clientY}px`;
                    clone.style.transform = "translate(-50%, -50%)";
                    clone.style.pointerEvents = "none";
                    clone.style.zIndex = "9999";
                    clone.style.opacity = "0.7";

                    document.body.appendChild(clone);
                    this._clone = clone;
                },
                { passive: false },
            );

            tool.addEventListener(
                "touchmove",
                function (e) {
                    if (!this._clone) return;

                    e.preventDefault();

                    this._clone.style.left = `${e.touches[0].clientX}px`;
                    this._clone.style.top = `${e.touches[0].clientY}px`;
                },
                { passive: false },
            );

            tool.addEventListener("touchend", function (e) {
                if (!this._clone) return;

                const touch = e.changedTouches[0];
                const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
                const cellElem = targetEl ? targetEl.closest(".grid-cell") : null;

                if (cellElem) {
                    board.placeIndicator(cellElem.dataset.x, cellElem.dataset.y, this.dataset.direction);
                }

                this._clone.remove();
                this._clone = null;
            });
        });
    };

    useEffect(() => {
        const style = useStyle(styles);

        board.setGrid(gridEl);
        game.setBoard(board);

        initState();
        initDragDrop();

        const levelEvent = board.eventSubscribe(EVENT.level, ({ data }) => {
            level.set(data + 1);
        });
        const moveEvent = board.eventSubscribe(EVENT.moves, ({ data }) => {
            moves.set(data);
        });
        const timeEvent = board.eventSubscribe(EVENT.time, ({ data }) => {
            const min = Math.floor(data / 60)
                .toString()
                .padStart(2, "0");

            const sec = (data % 60).toString().padStart(2, "0");

            time.set(`${min}:${sec}`);
        });

        const scoreEvent = board.eventSubscribe(EVENT.score, ({ data }) => {
            score.set(data);
        });

        fetch("levels.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to download levels");
                }
                return response.json();
            })
            .then((levels) => {
                game.setLevels(levels);
                game.start(levels);
            })
            .catch((error) => {
                console.error("Failed to download levels.json:", error);
                
                const levelCount = 30;
                const levels = generateLevels(levelCount);
                
                game.setLevels(levels);
                game.start(levels);
            });

        const endEvent = board.eventSubscribe(EVENT.end, () => {
            const r = store.get("game");

            if (r?.length) {
                r.at(-1).level = board.getLevel();
                r.at(-1).score = board.getScore();

                store.set("game", r);
                store.save();
            }

            navigate("score");
        });

        return () => {
            levelEvent.unsubscribe();
            moveEvent.unsubscribe();
            timeEvent.unsubscribe();
            scoreEvent.unsubscribe();
            endEvent.unsubscribe();
            style.cleanUp();
        };
    });

    return (
        <div>
            <div class="container">
                <div class="header">
                    <h1 class="title">
                        Level: <span ref={(el) => (levelEl = el)} />
                    </h1>
                    <div class="level-info">
                        <span id="levelMoves">
                            Moves: <span ref={(el) => (movesEl = el)} />
                        </span>
                        <span id="levelTime">
                            Time: <span ref={(el) => (timeEl = el)} />
                        </span>
                        <span id="levelTime">
                            Score: <span ref={(el) => (scoreEl = el)} />
                        </span>
                    </div>
                </div>

                <div class="game-area">
                    <div class="grid-container">
                        <div class="grid" ref={(el) => (gridEl = el)}></div>
                    </div>

                    <div class="toolbar" id="toolbar">
                        <div class="tool" data-direction="up" draggable="true">
                            ↑
                        </div>
                        <div class="tool" data-direction="down" draggable="true">
                            ↓
                        </div>
                        <div class="tool" data-direction="left" draggable="true">
                            ←
                        </div>
                        <div class="tool" data-direction="right" draggable="true">
                            →
                        </div>
                    </div>

                    <div class="controls">
                        <button
                            type="button"
                            class="btn secondary-btn"
                            onClick={() => {
                                game.stop();
                            }}
                        >
                            Exit Game
                        </button>
                        <button
                            type="button"
                            class="btn secondary-btn"
                            onClick={function () {
                                if (onPause) {
                                    onPause = false;
                                    this.textContent = "Pause";
                                    board.timerStart();
                                } else {
                                    onPause = true;
                                    this.textContent = "Resume";
                                    board.timerStop();
                                }
                            }}
                        >
                            Pause
                        </button>
                        <button type="button" class="btn secondary-btn" onClick={() => {
                            game.configure();
                        }}>
                            Restart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
