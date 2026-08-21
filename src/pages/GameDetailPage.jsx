import axios from "axios";
import LoaderImg from "../assets/loading.gif";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DetailRow from "../components/DetailRow";

function GameDetailPage() {
  console.log("test");

  const [game, setGame] = useState(null);
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
        <div className="flex gap-6">
          <img src={game.image} alt={game.title} className="w-48 rounded-lg" />
          <div>
            <h1 className="text-3xl font-bold">{game.title}</h1>
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
