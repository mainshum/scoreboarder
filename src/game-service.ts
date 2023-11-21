import { createNewGame } from "@mainshum/scoreboard";
import { produce } from "immer";
import { nanoid } from "nanoid";

export type Game = ReturnType<typeof createNewGame>["gameStats"] & {
  id: string;
};

export const Scoreboard = (games: Game[] = []) => ({
  finishGame(gameId: string) {
    return Scoreboard(games.filter((g) => g.id !== gameId));
  },
  addPoints(gameId: string, team: "home" | "away", points: number) {
    const updated = produce(games, (draft) => {
      const game = draft.find((g) => g.id === gameId);

      if (!game) return draft;

      game[team].score += points;
    });
    return Scoreboard(updated);
  },
  startGame(home: string, away: string) {
    return Scoreboard([
      ...games,
      {
        home: {
          name: home,
          score: 0,
        },
        away: {
          name: away,
          score: 0,
        },
        id: nanoid(),
      },
    ]);
  },
  getGames() {
    return games;
  },
});
