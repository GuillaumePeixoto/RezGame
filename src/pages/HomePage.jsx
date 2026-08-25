// HomePage.jsx
import axios from "axios";
import LoaderImg from "../assets/loading.gif";
import { useEffect, useState } from "react";
import GameSlider from "../components/GameSlider";
import "keen-slider/keen-slider.min.css";

function HomePage() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtersList, setFiltersList] = useState(null);
  const [sliderConfigs, setSliderConfigs] = useState([]);

  const getGames = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/games`);
      setGames(response.data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const getFilters = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/filters`,
      );
      setFiltersList(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const buildConfigsFromFilters = (filters) => {
    const configs = [];

    filters.typeOfGames.forEach((type) => {
      configs.push({
        title: `${type.name} Games`,
        category: "typeOfGame",
        categoryValue: type.name,
        categoryId: type.id
      });
    });

    filters.themes.forEach((theme) => {
      configs.push({
        title: `${theme.name} Games`,
        category: "theme",
        categoryValue: theme.name,
        categoryId: theme.id
      });
    });

    filters.playingModes.forEach((mode) => {
      configs.push({
        title: `${mode.name} Games`,
        category: "playingMode",
        categoryValue: mode.name,
        categoryId: mode.id
      });
    });

    filters.platforms.forEach((platform) => {
      configs.push({
        title: `${platform.name} Games`,
        category: "platform",
        categoryValue: platform.name,
        categoryId: platform.id
      });
    });

    configs.push({ title: `${new Date().getFullYear()} Games`, special: "latest", year: new Date().getFullYear() })

    return configs;
  };

  const pickRandomConfigs = (configs, count) => {
    return [...configs].sort(() => Math.random() - 0.5).slice(0, count);
  };

  const filteredGames = (config, limit) => {
    if (config.special === "latest") {
      return games
        .filter((g) => Number(g.releaseYear) === config.year)
        .slice(0, limit);
    }

    return games
      .filter((g) =>
        g[config.category].some((item) => item.name === config.categoryValue),
      )
      .slice(0, limit);
  };

  useEffect(() => {
    getGames();
    getFilters();
  }, []);

  useEffect(() => {
    if (filtersList && games.length > 0 && sliderConfigs.length === 0) {
      const allConfigs = [
        ...buildConfigsFromFilters(filtersList),
      ];

      const configsWithResults = allConfigs.filter(
        (config) => filteredGames(config, 15).length > 0,
      );

      setSliderConfigs(pickRandomConfigs(configsWithResults, 4));
    }
  }, [filtersList, games]);

  if (isLoading) {
    return (
      <img
        src={LoaderImg}
        className="absolute w-[15%] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
      />
    );
  }

  return (
    <div className="homepage text-white">
      <div>
        <h1 className="text-5xl text-center">Test our Guess Game</h1>
        <button className="flex mx-auto mt-4 text-xl cursor-pointer py-2 px-4 bg-(--yellow) rounded-md">
          Play!
        </button>
      </div>
      <div className="game-list-with-filters flex flex-col gap-8">
        {sliderConfigs.map((config, index) => (
          <GameSlider
            key={index}
            title={config.title}
            config={config}
            games={filteredGames(config, 15)}
          />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
