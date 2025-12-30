/** @jsx h */
/** @jsxFrag Fragment */

import { Fragment, h, initRouter, navigate } from "@/core";
import { GamePage } from "@/pages/game/game";
import { MenuPage } from "@/pages/menu/menu";
import { ScorePage } from "@/pages/score/score";

initRouter(
	{
		menu: MenuPage,
		game: GamePage,
		score: ScorePage,
	},
	"menu",
);

export function Index() {
	navigate("menu");
	return null;
}
