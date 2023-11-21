import React, { FormEvent } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Game, Scoreboard } from "./game-service";
import tw from "tailwind-styled-components";
import { nanoid } from "nanoid";
import { useAutoAnimate } from "@formkit/auto-animate/react";

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
  onAddNew: (home: string, away: string) => void;
}) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const elements = e.currentTarget.elements;
    const home = elements.namedItem("home") as HTMLInputElement;
    const away = elements.namedItem("away") as HTMLInputElement;

    onAddNew(home.value, away.value);

    home.value = "";
    away.value = "";
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
          <Container className="p-1" $as="input" name="home" type="text" />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="away">Away</Label>
          <Container className="p-1" $as="input" name="away" type="text" />
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Game
      </button>
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
      <Button onClick={() => onAdd(id, "home")}>+</Button>
      <Button onClick={() => onFinish(id)} className="col-start-3">
        Finish game
      </Button>
      <Button onClick={() => onAdd(id, "away")} className="col-start-5">
        +
      </Button>
    </Container>
  );
};

const App = () => {
  const [scoreboard, setScoreboard] = React.useState(
    Scoreboard([
      {
        home: { name: "mae", score: 0 },
        away: { name: "mae", score: 0 },
        id: nanoid(),
      },
    ])
  );

  const [gamesRef] = useAutoAnimate();

  const handleAddNew = (home: string, away: string) => {
    setScoreboard((s) => s.startGame(home, away));
  };

  const handleFinish = (gameId: string) => {
    setScoreboard((s) => s.finishGame(gameId));
  };

  const handleAdd = (gameId: string, whoScored: "home" | "away") => {
    setScoreboard((s) => s.addPoints(gameId, whoScored, 1));
  };

  return (
    <main className="flex flex-col gap-6 justify-center items-center p-24 ">
      <GameOperations onAddNew={handleAddNew} />
      <div ref={gamesRef} className="flex flex-col gap-4">
        {scoreboard.getGames().map((game) => (
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
