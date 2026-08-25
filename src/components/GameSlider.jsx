// components/GameSlider.jsx
import { useKeenSlider } from "keen-slider/react";
import GameCard from "./GameCard";
import { Link } from "react-router-dom";

function GameSlider({ title, games, config }) {
  const [sliderRef] = useKeenSlider({
    loop: false,
    mode: "free",
    slides: {
      perView: 5,
      spacing: 15,
    },
    breakpoints: {
      "(max-width: 640px)": {
        slides: { perView: 2.3, spacing: 10 },
      },
      "(min-width: 641px) and (max-width: 1024px)": {
        slides: { perView: 3.5, spacing: 12 },
      },
      "(min-width: 1025px)": {
        slides: { perView: 3.8, spacing: 15 },
      },
      "(min-width: 1440px)": {
        slides: { perView: 4.8, spacing: 15 },
      },
      "(min-width: 1840px)": {
        slides: { perView: 6.5, spacing: 15 },
      },
    },
  });

  if (games.length === 0) return null;

  return (
    <div>
      <div className="flex justify-between">
        <p>{title}</p>
        <Link to={`games?${config.category}=${config.categoryId}`}>← View all</Link>
      </div>
      <div ref={sliderRef} className="keen-slider">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}

export default GameSlider;