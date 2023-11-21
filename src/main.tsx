import React, { FormEvent } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Game, Scoreboard } from "./game-service";
import tw from "tailwind-styled-components";
import { nanoid } from "nanoid";

type GameHandlersContext = {
  onAddNew: (h: string, away: string) => void;
  scoreboard: ReturnType<typeof Scoreboard>;
};

const gameHandlersCtx = React.createContext({} as GameHandlersContext);

const Container = tw.div`
  rounded
  border 
  border-lightgray-500
  p-6
`;

const GameOperations = () => {
  const { onAddNew } = React.useContext(gameHandlersCtx);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const elements = e.currentTarget.elements;
    const home = elements.namedItem("home") as HTMLInputElement;
    const away = elements.namedItem("away") as HTMLInputElement;

    onAddNew(home.value, away.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col border-yellow-50 border-2"
    >
      <div>
        <label htmlFor="home">Home</label>
        <input name="home" type="text" id="home" />
        <label htmlFor="away">Away</label>
        <input type="text" id="away" />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Game
      </button>
    </form>
  );
};

const Button = tw.button`
  rounded
  border
  border-lightgray-900
  bg-lightgray-500
  p-2
  text-sm
`;

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
      <span>{home.name}</span>
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
  const [idUpdating, setIdUpdating] = React.useState<string | null>(null);
  const [scoreboard, setScoreboard] = React.useState(
    Scoreboard([
      {
        home: { name: "mae", score: 0 },
        away: { name: "mae", score: 0 },
        id: nanoid(),
      },
    ])
  );

  const onAddNew = React.useCallback((home: string, away: string) => {
    setScoreboard((s) => s.startGame(home, away));
  }, []);

  const handleFinish = (gameId: string) => {
    setScoreboard((s) => s.finishGame(gameId));
  };

  const handleAdd = (gameId: string, whoScored: "home" | "away") => {
    setScoreboard((s) => s.addPoints(gameId, whoScored, 1));
  };

  return (
    <gameHandlersCtx.Provider value={{ onAddNew, scoreboard }}>
      <main className="flex justify-center items-center p-24 ">
        <GameOperations />
        <div>
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
    </gameHandlersCtx.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
