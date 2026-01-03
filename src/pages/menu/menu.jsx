/** @jsx h */
/** @jsxFrag Fragment */

import { Fragment, h, navigate, useEffect, useStyle } from "@/core";
import { store } from "@/services/store.js";

import styles from "./menu.css?inline";

export function MenuPage() {
	let confirmEl, howToEl;

	useEffect(() => useStyle(styles).cleanUp);

	const onClickGame = () => {
		const name = document.getElementById("nameInput").value?.trim();

		if (!name) {
			confirmEl.showModal();
			nameInput.focus();
			return;
		}

		fetch("/api/generate-levels", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.catch((error) => {
				console.error("Nepodarilo sa vygenerovat levely:", error);
			})
			.finally(() => {
				let gameData = store.get("game");
				if (gameData) {
					const newGame = {
						date: Date.now(),
						name: name,
						score: 0,
						level: 0,
					};
					gameData.push(newGame);
				} else {
					gameData = [
						{
							date: Date.now(),
							name: name,
							score: 0,
							level: 0,
						},
					];
				}

				store.set("game", gameData);
				store.save();

				navigate("game");
			});
	};

	return (
		<div class="container">
			<h1 class="title">REDIRECT GAME</h1>
			<dialog ref={(el) => (confirmEl = el)}>
				<h2>Bro, we cant continue without your name. Just do it!</h2>

				<div class="modal-actions">
					<button
						type="button"
						class="secondary-btn"
						onClick={() => {
							confirmEl.close();
						}}
					>
						OK
					</button>
				</div>
			</dialog>
			<dialog ref={(el) => (howToEl = el)}>
				<h2>How to Play</h2>
				<p>1. Enter a nickname and start the game.</p>
				<p>2. The emoji moves from the starting point in a specific direction.</p>
				<p>3. Place arrows to guide the emoji; double-click an arrow to delete it.</p>
				<p>4. You have a limited time and a set number of arrows.</p>
				<p>5. Guide the emoji to the finish line without crashing.</p>
				<p>6. Earn points by completing levels and track your progress in the history.</p>
				<div class="modal-actions">
					<button
						type="button"
						class="secondary-btn"
						onClick={() => {
							howToEl.close();
						}}
					>
						OK
					</button>
				</div>
			</dialog>
			<p class="description">
				As a <strong>Stream Operator</strong>, you must deploy <strong>Quantum Beacons</strong> to
				bypass Obsidian Mountains and guide the signal to the Core before it decays.
				<strong>One wrong turn, and the data is purged.</strong>
			</p>
			<div class="input-container">
				<input id="nameInput" type="text" class="name-input" placeholder="Enter your name" />
			</div>
			<button type="button" onClick={() => onClickGame()} class="start-btn">
				Start Game
			</button>
			<button type="button" onClick={() => {
				howToEl.showModal();
			}} class="secondary-btn">
				How to play
			</button>
			<button type="button" onClick={() => navigate("score")} class="secondary-btn">
				Score History
			</button>
		</div>
	);
}
