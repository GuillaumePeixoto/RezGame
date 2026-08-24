import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";
import { customStyles } from '../styles/selectStyleReact';

function GuessGame() {
  const [gameToGuess, setGameToGuess] = useState(null);
  const [isLoading, setIsLoarding] = useState(true);
  const [games, setGames] = useState([]);
  const [userGuess, setUserGuess] = useState('');
  const [previousUserGuess, setPreviousUserGuess ] = useState([]);

  const handleUserGuess = (e) => {
    console.log(e);
  }

  const getGames = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/games`);
      setGames(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getGames();
  }, []);

  return (
    <div className="text-white font-bold bg-[#3d3c3c] w-full p-4 rounded-2xl">
      <h2 className="pixel-family text-6xl text-center">Guess Game</h2>

      <form>
        <Select
          className="basic-multi-select h-full"
          options={
            games?.title
              ? games.title.map((g) => ({
                  value: g.id,
                  label: g.name,
                }))
              : []
          }
          value={userGuess}
          styles={customStyles}
          onChange={handleUserGuess}
          placeholder="Guess a game"
        />
      </form>
    </div>
  );
}

export default GuessGame;
