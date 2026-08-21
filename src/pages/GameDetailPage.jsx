import axios from "axios";
import LoaderImg from "../assets/loading.gif";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DetailRow from "../components/DetailRow";

function GameDetailPage() {

  const [game, setGame] = useState(null);
  const navigate = useNavigate();

  const { gameId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const getGame = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/games/${gameId}`,
      );
      setGame(response.data);
      console.log(response.data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteGame = async () => {
    try{
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/games/${gameId}`);
      navigate('/games');
    }catch(e) {
      console.log(e);
    }
  }

  const handleDelete = () => {
    deleteGame();
  }

  useEffect(() => {
    getGame();
  }, []);

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
      <div className="fiche-jeu bg-neutral-800 rounded-xl p-6">
        {/* Header : image + titre + année */}
        <div className="flex flex-col md:flex-row gap-6 w-full">
          <div className="w-48 flex-shrink-0">
            <img
              src={game.image}
              alt={game.title}
              className="w-48 rounded-lg"
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-row justify-between align-middle">
              <h1 className="text-3xl font-bold">{game.title}</h1>
              <div className="flex gap-2">
                <Link to={`/games/update/${game.id}`}>
                  <button className="bg-neutral-900 px-3 h-full rounded-lg text-(--yellow) border border-(--yellow) cursor-pointer">
                    <i className="bi bi-pencil-square"></i>
                  </button>
                </Link>
                <button onClick={handleDelete} className="text-red-700 px-3 rounded-lg bg-neutral-900 border border-red-700 cursor-pointer">
                  <i className="bi bi-trash3"></i>
                </button>
              </div>
            </div>
            <p className="text-neutral-400">{game.releaseYear}</p>
            <p className="text-neutral-400">
              {game.editor.map((e) => e.name).join(", ")}
            </p>
          </div>
        </div>

        {/* Bloc détails, une sous-fiche plus claire */}
        <div className="bg-neutral-700 rounded-lg p-4 mt-6 space-y-3">
          <DetailRow label="Genre" items={game.typeOfGame} />
          <DetailRow label="Thèmes" items={game.theme} />
          <DetailRow label="Vue" items={game.typeOfView} />
          <DetailRow label="Mode de jeu" items={game.playingMode} />
          <DetailRow label="Plateformes" items={game.platform} />
        </div>
      </div>
    </div>
  );
}

export default GameDetailPage;
