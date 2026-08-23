import axios from "axios";
import LoaderImg from "../assets/loading.gif";
import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import { Link } from "react-router-dom";

function GamesList() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getGames = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/games`);
      setGames(response.data);
      console.log(response.data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getGames();
  }, []);

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <h3 className="text-3xl text-white">Games</h3>
        <Link to="/add-game" className="bg-(--yellow) px-5 py-3 rounded-lg text-xl hover:bg-transparent hover:text-(--yellow) border-2 hover:border-(--yellow)">
          Add game
        </Link>
      </div>
      {isLoading && <img src={LoaderImg} />}
        {games.length > 1 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
            {games.map((game) => {
              return <GameCard key={game.id} game={game} />;
            })}
          </div>
        )}
    </div>
  );
}

export default GamesList;
