import axios from "axios";
import LoaderImg from "../assets/loading.gif";
import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

function HomePage() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: false,
    mode: "free",
    slides: {
      perView: "auto",
      spacing: 2,
    },
    // breakpoints: {
    //   "(min-width: 420px)": {
    //     slides: { perView: "auto", spacing: 1 },
    //   },
    //   "(min-width: 768px)": {
    //     slides: { perView: 2.2, spacing: 1 },
    //   },
    //   "(min-width: 1024px)": {
    //     slides: { perView: 3, spacing: 15 },
    //   },
    // },
  });

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

  useEffect(() => {
    if (games.length > 0) {
      instanceRef.current?.update();
    }
  }, [games]);

  return (
    <div className="homepage text-white">
      <div>
        <h1 className="text-5xl text-center">Test our Guess Game</h1>
        <button className="flex mx-auto mt-4 text-xl cursor-pointer py-2 px-4 bg-(--yellow) rounded-md">
          Play!
        </button>
      </div>
      <div className="game-list-with-filters">
        <div>
          <div className="flex justify-between">
            <p>Latest Game Added</p>
            <a href="#">← View all</a>
          </div>
          <div ref={sliderRef} className="keen-slider">
            {isLoading && <img src={LoaderImg} />}
            {games.length > 1 &&
              games.map((game) => {
                return <GameCard key={game.id} game={game} />;
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
