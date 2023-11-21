import { createNewGame } from "@mainshum/scoreboard";
import { produce } from "immer";
import { nanoid } from "nanoid";

export type Game = ReturnType<typeof createNewGame>["gameStats"] & {
  id: string;
};

const sortByTotalScore = (a: Game, b: Game) => {
  const aTotal = a.home.score + a.away.score;
  const bTotal = b.home.score + b.away.score;

  if (aTotal > bTotal) return -1;
  if (aTotal < bTotal) return 1;
  return 0;
};

export const createScoreboard = (games: Game[] = []) => ({
  finishGame(gameId: string) {
    return createScoreboard(games.filter((g) => g.id !== gameId));
  },
  addPoints(gameId: string, team: "home" | "away", points: number) {
    return createScoreboard(
      produce(games, (draft) => {
        const game = draft.find((g) => g.id === gameId);

        if (!game) return draft;

        game[team].score += points;
      })
    );
  },
  teamPlaying(...teams: string[]) {
    return games.some(
      (g) => teams.includes(g.home.name) || teams.includes(g.away.name)
    );
  },
  startGame(home: string, away: string) {
    return createScoreboard(
      produce(games, (draft) => {
        draft.push({
          home: {
            name: home,
            score: 0,
          },
          away: {
            name: away,
            score: 0,
          },
          id: nanoid(),
        });
      })
    );
  },
  getGames() {
    return games.slice().reverse().sort(sortByTotalScore);
  },
});
