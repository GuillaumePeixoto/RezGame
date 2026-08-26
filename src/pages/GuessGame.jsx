import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";
import { customStyles } from "../styles/selectStyleReact";
import LoaderImg from "../assets/loading.gif";

function GuessGame() {
  const [gameToGuess, setGameToGuess] = useState(null);
  const [isLoading, setIsLoarding] = useState(true);
  const [games, setGames] = useState([]);
  const [userGuess, setUserGuess] = useState("");
  const [previousUserGuess, setPreviousUserGuess] = useState([]);
  const [tryGuessRemaining, setTryGuessRemaining] = useState(6);
  const [winInRow, setWinInRow] = useState(0);
  const [hasWon, setHasWon] = useState(false);

  const handleUserGuess = (e) => {
    console.log(e);
    setUserGuess(e);
  };

  const getGames = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/games`);
      setGames(response.data);
      setIsLoarding(false);
    } catch (e) {
      console.log(e);
    }
  };

  const checkGameProprety = (gameProperty, GuessProperty) => {
    if (typeof gameProperty === "string") {
      return gameProperty === GuessProperty;
    }
    if (Array.isArray(gameProperty) && gameProperty.length > 0) {
      return gameProperty.some(
        (property) => "" + property.id === "" + GuessProperty,
      );
    }
    return false;
  };

  const checkGameReleaseYear = (gameRelease, guessRelease) => {
    let gameR = parseInt(gameRelease);
    let guessR = parseInt(guessRelease);

    if (gameR > guessR) {
      return "↑";
    } else if (gameR < guessR) {
      return "↓";
    } else if (gameR === guessR) {
      return "=";
    }

    return null;
  };

  const reloadGame = () => {
    setTryGuessRemaining(6);
    let randomNumber = Math.floor(Math.random() * games.length);
    setGameToGuess(games[randomNumber]);
    setPreviousUserGuess([]);
    setWinInRow(0);
    setHasWon(false);
  };

  const handleUserGuessForm = (e) => {
    e.preventDefault();

    let gameGuessed = games.find((game) => game.id === userGuess.value);

    if (
      previousUserGuess.find(
        (gameGuessed) => gameGuessed.id === userGuess.value,
      )
    ) {
      return;
    }

    if (gameToGuess.id === userGuess.value) {
      setWinInRow(winInRow + 1);
      setHasWon(true);
      return;
    }

    setPreviousUserGuess((previous) => [gameGuessed, ...previous]);
    setTryGuessRemaining(tryGuessRemaining - 1);
    if (tryGuessRemaining < 1) {
      setWinInRow(0);
    }
  };

  useEffect(() => {
    getGames();
  }, []);

  useEffect(() => {
    let randomNumber = Math.floor(Math.random() * games.length);
    setGameToGuess(games[randomNumber]);
  }, [games]);

  if (isLoading) {
    return (
      <img
        src={LoaderImg}
        className="absolute w-[15%] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
      />
    );
  }

  return (
    <div className="text-white font-bold bg-[#3d3c3c] w-full p-4 rounded-2xl">
      <h2 className="pixel-family text-6xl text-center mb-4">Guess Game</h2>

      {hasWon && (
        <div className="flex flex-col justify-center items-center mb-4">
          <h6 className="text-3xl mt-1 text-green-500 font-bold">You win!</h6>
          <p className="text-neutral-400 my-2 text-lg">
            {winInRow > 1 ? `${winInRow} wins in a row!` : "Well guessed!"}
          </p>
          <img
            src={gameToGuess.image}
            alt={gameToGuess.title}
            className="w-92 rounded-lg"
          />
          <h5 className="text-2xl mt-3">{gameToGuess.title}</h5>
          <button
            onClick={reloadGame}
            className="px-8 py-4 bg-(--yellow) rounded-lg cursor-pointer mt-4 border-2 border-(--yellow) hover:bg-neutral-700 hover:text-(--yellow)"
          >
            Next game
          </button>
        </div>
      )}

      {tryGuessRemaining === 0 && !hasWon && (
        <div className="flex flex-col justify-center items-center mb-4">
          <h6 className="text-3xl mt-1 text-red-500 font-bold">You lose</h6>
          <p className="text-neutral-400 my-2 text-lg">The game was:</p>
          <img
            src={gameToGuess.image}
            alt={gameToGuess.title}
            className="w-92 rounded-lg"
          />
          <h5 className="text-2xl mt-3">{gameToGuess.title}</h5>
          <button
            onClick={reloadGame}
            className="px-8 py-4 bg-(--yellow) rounded-lg cursor-pointer mt-4 border-2 border-(--yellow) hover:bg-neutral-700 hover:text-(--yellow)"
          >
            Play again
          </button>
        </div>
      )}
      {tryGuessRemaining > 0 && !hasWon && (
        <div className="mt-12">
          {winInRow > 0 && (
            <p className="text-neutral-400 mb-4 text-lg text-center">
              Win streak: {winInRow}
            </p>
          )}

          <form
            onSubmit={handleUserGuessForm}
            className="flex flex-wrap w-full gap-x-6 justify-center"
          >
            <Select
              className="basic-multi-select h-full w-2/3"
              options={
                games
                  ? games.map((g) => ({
                      value: g.id,
                      label: g.title,
                    }))
                  : []
              }
              value={userGuess}
              styles={customStyles}
              onChange={handleUserGuess}
              placeholder="Guess a game"
            />
            <button className="px-6 py-4 bg-(--yellow) rounded-lg cursor-pointer">
              Guess
            </button>
          </form>
          <div className="my-10">
            <p className="text-center text-lg">
              Try Remaining : {tryGuessRemaining} / 6
            </p>
          </div>
        </div>
      )}

      {previousUserGuess.length > 0 && !hasWon && tryGuessRemaining > 0 && (
        <div className="w-5/6 mx-auto mt-0 overflow-x-auto">
          <table className="w-full mt-8 border-collapse mb-4 overflow-hidden rounded-lg">
            <thead>
              <tr className="bg-[#1a1a1a] text-(--yellow)">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Type of game</th>
                <th className="px-4 py-3 text-left">Theme</th>
                <th className="px-4 py-3 text-left">Release Year</th>
                <th className="px-4 py-3 text-left">Playing Mode</th>
                <th className="px-4 py-3 text-left">Type of view</th>
                <th className="px-4 py-3 text-left">Editor</th>
                <th className="px-4 py-3 text-left">Platform</th>
              </tr>
            </thead>
            <tbody>
              {previousUserGuess.map((guess, index) => {
                return (
                  <tr
                    key={guess.id}
                    className={`${
                      index % 2 === 0 ? "bg-[#2a2a2a]" : "bg-[#242424]"
                    } hover:bg-[#333] transition-colors`}
                  >
                    <td className="px-4 py-3 font-bold">{guess.title}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {guess.typeOfGame.map((type) => {
                          return (
                            <span
                              key={type.id}
                              style={{
                                backgroundColor: checkGameProprety(
                                  gameToGuess.typeOfGame,
                                  type.id,
                                )
                                  ? "green"
                                  : "red",
                              }}
                              className="bg-neutral-600 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap"
                            >
                              {type.name}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {guess.theme.map((theme) => {
                          return (
                            <span
                              key={theme.id}
                              style={{
                                backgroundColor: checkGameProprety(
                                  gameToGuess.theme,
                                  theme.id,
                                )
                                  ? "green"
                                  : "red",
                              }}
                              className="bg-neutral-600 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap"
                            >
                              {theme.name}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-300">
                      <span
                        className="p-2 rounded-lg"
                        style={{
                          backgroundColor:
                            checkGameReleaseYear(
                              gameToGuess.releaseYear,
                              guess.releaseYear,
                            ) === "="
                              ? "green"
                              : "red",
                        }}
                      >
                        {guess.releaseYear}{" "}
                        {checkGameReleaseYear(
                          gameToGuess.releaseYear,
                          guess.releaseYear,
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {guess.playingMode.map((mode) => {
                          return (
                            <span
                              key={mode.id}
                              style={{
                                backgroundColor: checkGameProprety(
                                  gameToGuess.playingMode,
                                  mode.id,
                                )
                                  ? "green"
                                  : "red",
                              }}
                              className="bg-neutral-600 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap"
                            >
                              {mode.name}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {guess.typeOfView.map((view) => {
                          return (
                            <span
                              key={view.id}
                              style={{
                                backgroundColor: checkGameProprety(
                                  gameToGuess.typeOfView,
                                  view.id,
                                )
                                  ? "green"
                                  : "red",
                              }}
                              className="bg-neutral-600 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap"
                            >
                              {view.name}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {guess.editor.map((editor) => {
                          return (
                            <span
                              key={editor.id}
                              style={{
                                backgroundColor: checkGameProprety(
                                  gameToGuess.editor,
                                  editor.id,
                                )
                                  ? "green"
                                  : "red",
                              }}
                              className="bg-neutral-600 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap"
                            >
                              {editor.name}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {guess.platform.map((plat) => {
                          return (
                            <span
                              key={plat.id}
                              style={{
                                backgroundColor: checkGameProprety(
                                  gameToGuess.platform,
                                  plat.id,
                                )
                                  ? "green"
                                  : "red",
                              }}
                              className="bg-neutral-600 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap"
                            >
                              {plat.name}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default GuessGame;
