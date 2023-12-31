import React, { FormEvent, useMemo } from "react";
import { Game, createScoreboard } from "./game-service";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import tw from "tailwind-styled-components";

const Container = tw.div`
  rounded
  border 
  border-lightgray-500
  p-6
`;

const Button = tw.button`
  rounded
  border
  border-lightgray-900
  bg-lightgray-500
  p-2
  text-sm
`;

const Label = tw.label`
  text-sm
  text-gray-500
  font-semibold
`;

const GameOperations = ({
  onAddNew,
}: {
  onAddNew: (homeEl: HTMLInputElement, awayEl: HTMLInputElement) => void;
}) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const elements = e.currentTarget.elements;
    const home = elements.namedItem("home") as HTMLInputElement;
    const away = elements.namedItem("away") as HTMLInputElement;

    onAddNew(home, away);
  };

  return (
    <Container
      $as="form"
      onSubmit={(e) => handleSubmit(e as FormEvent<HTMLFormElement>)}
      className="flex flex-col gap-4 justify-center items-center"
    >
      <div className="flex gap-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor="home">Home</Label>
          <Container
            placeholder="Team name"
            className="p-1"
            $as="input"
            name="home"
            type="text"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="away">Away</Label>
          <Container
            placeholder="Team name"
            className="p-1"
            $as="input"
            name="away"
            type="text"
          />
        </div>
      </div>
      <Button type="submit" className="">
        Add Game
      </Button>
    </Container>
  );
};

const Game = ({
  game: { home, away, id },
  onFinish,
  onAdd,
}: {
  game: Game;
  onFinish: (id: string) => void;
  onAdd: (id: string, team: "home" | "away") => void;
}) => {
  return (
    <Container className="grid grid-rows-2 grid-cols-5 text-center">
      <span>{home.name}</span>
      <span>{home.score}</span>
      <span>-</span>
      <span>{away.score}</span>
      <span>{away.name}</span>
      <Button data-testid="home-add" onClick={() => onAdd(id, "home")}>
        +
      </Button>
      <Button onClick={() => onFinish(id)} className="col-start-3">
        Finish game
      </Button>
      <Button
        data-testid="away-add"
        onClick={() => onAdd(id, "away")}
        className="col-start-5"
      >
        +
      </Button>
    </Container>
  );
};
export const App = ({ initialGames = [] }: { initialGames?: Game[] }) => {
  const [scoreboard, setScoreboard] = React.useState(
    createScoreboard(initialGames)
  );

  const [gamesRef] = useAutoAnimate();

  const handleAddNew = (home: HTMLInputElement, away: HTMLInputElement) => {
    if (!home.value || !away.value) {
      alert("Please enter both team names");
      return;
    }

    if (scoreboard.teamPlaying(home.value, away.value)) {
      alert("One of the teams is already playing");
      return;
    }

    setScoreboard(scoreboard.startGame(home.value, away.value));

    home.value = "";
    away.value = "";
  };

  const handleFinish = (gameId: string) => {
    setScoreboard(scoreboard.finishGame(gameId));
  };

  const handleAdd = (gameId: string, whoScored: "home" | "away") => {
    setScoreboard(scoreboard.addPoints(gameId, whoScored, 1));
  };

  const summary = useMemo(() => {
    return scoreboard.getGames();
  }, [scoreboard]);

  return (
    <main className="flex flex-col gap-6 justify-center items-center p-24 ">
      <GameOperations onAddNew={handleAddNew} />
      <div
        data-testid="game-summary"
        ref={gamesRef}
        className="flex flex-col gap-4"
      >
        {summary.map((game) => (
          <Game
            onFinish={handleFinish}
            onAdd={handleAdd}
            key={game.id}
            game={game}
          />
        ))}
      </div>
    </main>
  );
};
