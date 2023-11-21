import { App } from "../../src/app";

const startGame = (home: string, away: string) => {
  if (home) {
    cy.get('input[name="home"]').type(home);
  }
  if (away) {
    cy.get('input[name="away"]').type(away);
  }
  cy.get('button[type="submit"]').click();
};

const addPoints = (team: "home" | "away") => {
  cy.get(`button[data-testid="${team}-add"]`).click();
};

const getSummary = () => {
  return cy.get('div[data-testid="game-summary"]');
};

const finishGame = () => {
  return cy.findByRole("button", { name: /finish game/i }).click();
};

describe("App", () => {
  beforeEach(() => {
    cy.mount(<App />);
  });
  describe("startGame", () => {
    it("summary returns 3 games started", () => {
      for (let k = 0; k < 3; k++) {
        startGame(`home${k}`, `away${k}`);
      }

      getSummary().children().should("have.length", 3);
    });

    it("displays alert if a game is started with the same team twice", () => {
      cy.window().then((win) => {
        cy.stub(win, "alert").as("alert");

        startGame("a", "b");
        startGame("a", "b");

        cy.get("@alert").should(
          "be.calledWith",
          "One of the teams is already playing"
        );
      });
    });
    it("displays alert if a game started without inserting names", () => {
      cy.window().then((win) => {
        cy.stub(win, "alert").as("alert");

        startGame("", "");

        cy.get("@alert").should(
          "be.calledWith",
          "Please enter both team names"
        );
      });
    });
  });
  describe("updateScore", () => {
    it("equals 2-1 for home team if home team scores twice and away once", () => {
      startGame("home", "away");
      addPoints("home");
      addPoints("home");
      addPoints("away");

      getSummary()
        .children()
        .should("have.length", 1)
        .eq(0)
        .should("contain.text", "home2-1away");
    });
  });
  describe("finishGame", () => {
    it("removes the game from the summary if started", () => {
      startGame("home", "away");

      getSummary().children().should("have.length", 1);

      finishGame();

      getSummary().children().should("have.length", 0);
    });
  });

  describe("getSummary", () => {
    const games = [
      {
        home: { name: "Mexico", score: 0 },
        away: { name: "Canada", score: 5 },
        id: "1",
      },
      {
        home: { name: "Poland", score: 10 },
        away: { name: "Ecuador", score: 2 },
        id: "2",
      },
      {
        home: { name: "Portugal", score: 2 },
        away: { name: "Chile", score: 2 },
        id: "3",
      },
    ];

    it("returns in score order if all total scores differ", () => {
      cy.mount(<App initialGames={games} />);

      getSummary()
        .children()
        .should("have.length", 3)
        .then((games) => {
          expect(games[0]).to.contain.text("Poland10-2Ecuador"); // 12
          expect(games[1]).to.contain.text("Mexico0-5Canada"); // 5
          expect(games[2]).to.contain.text("Portugal2-2Chile"); // 4
        });
    });
    it("returns in score order and recency order, if total scores for multiple games are equal, ", () => {
      const updated = games.concat([
        {
          home: { name: "Uruguay", score: 6 },
          away: { name: "Italy", score: 6 },
          id: "4",
        }, // 12
        {
          home: { name: "Argentina", score: 6 },
          away: { name: "Australia", score: 6 },
          id: "5",
        }, // 12
      ]);
      cy.mount(<App initialGames={updated} />);

      getSummary()
        .children()
        .should("have.length", 5)
        .then((games) => {
          expect(games[0]).to.contain.text("Argentina"); // 12
          expect(games[1]).to.contain.text("Uruguay"); // 5
          expect(games[2]).to.contain.text("Poland"); // 4
          expect(games[3]).to.contain.text("Mexico"); // 4
          expect(games[4]).to.contain.text("Portugal"); // 4
        });
    });
  });
});
