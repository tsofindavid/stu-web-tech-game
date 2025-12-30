/** @jsx h */
/** @jsxFrag Fragment */

import { Fragment, h, navigate, useEffect, useStyle } from "@/core";
import { store } from "@/services/store.js";

import styles from "./score.css?inline";

export function ScorePage() {
	let historyEl, modalEl, clearBtnEl;

	const loadHistory = () => {
		const r = store.get("game");

		if (r) {
			clearBtnEl.hidden = false;
			r.forEach(({ date, name, level, score }) => {
				historyEl.appendChild(
					<div class="try-item">
						<div class="try-date">Date: {new Date(date).toLocaleDateString()}</div>
						<div class="try-details">
							<span>Name: {name}</span>
							<span>Level: {level + 1}</span>
							<span>Score: {score}</span>
						</div>
					</div>,
				);
			});
		} else {
			clearBtnEl.hidden = true;
			historyEl.innerHTML = "";
			historyEl.appendChild(
				<div class="empty-message">No games played yet. Start a new game!</div>,
			);
		}
	};

	useEffect(() => {
		const { cleanUp } = useStyle(styles);
		loadHistory();
		return cleanUp;
	});

	const onClear = () => {
		store.clean();
		store.save();

		loadHistory();
		modalEl.close();
	};

	return (
		<div class="container">
			<dialog ref={(el) => (modalEl = el)}>
				<h2>Clear Score History</h2>
				<p>Are you sure ?</p>

				<div class="modal-actions">
					<button
						type="button"
						class="secondary-btn"
						onClick={() => {
							onClear();
						}}
					>
						Clear
					</button>
					<button
						type="button"
						class="secondary-btn"
						onClick={() => {
							modalEl.close();
						}}
					>
						Cancel
					</button>
				</div>
			</dialog>
			<h1 class="title">Game Scores</h1>
			<div class="tries-list" ref={(el) => (historyEl = el)}></div>
			<button
				type="button"
				class="secondary-btn"
				onClick={() => {
					navigate("menu");
				}}
			>
				Back to Home
			</button>
			<button
				type="button"
				class="secondary-btn"
				onClick={() => {
					modalEl.showModal();
				}}
				ref={(el) => (clearBtnEl = el)}
			>
				Clear History
			</button>
		</div>
	);
}
