import axios from "axios";
import LoaderImg from "../assets/loading.gif";
import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import { Link } from "react-router-dom";
import Select from "react-select";
import { customStyles } from '../styles/selectStyleReact';

function GamesList() {
  const [games, setGames] = useState([]);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [titleFilter, setTitleFilter] = useState("");
  const [typeOfGame, setTypeOfGame] = useState([]);
  const [theme, setTheme] = useState([]);
  const [releaseYear, setReleaseYear] = useState("");
  const [editor, setEditor] = useState([]);
  const [typeOfView, setTypeOfView] = useState([]);
  const [playingMode, setPlayingMode] = useState([]);
  const [platform, setPlatform] = useState([]);

  const handleTitle = (e) => {
    setTitleFilter(e.target.value);
  };

  const handleTypeOfGame = (e) => {
    setTypeOfGame(e);
  };

  const handleTheme = (e) => {
    setTheme(e);
  };

  const handleReleaseYear = (e) => {
    setReleaseYear(e.target.value);
  };

  const handleEditor = (e) => {
    setEditor(e);
  };

  const handleTypeOfView = (e) => {
    setTypeOfView(e);
  };

  const handlePlayingMode = (e) => {
    setPlayingMode(e);
  };

  const handlePlatform = (e) => {
    setPlatform(e);
  };

  const handleFilterForm = async (e) => {
    e.preventDefault();

    let filtersRequest = "";

    const addFilter = (key, value) => {
      filtersRequest +=
        filtersRequest === "" ? `?${key}=${value}` : `&${key}=${value}`;
    };

    if (titleFilter) {
      addFilter("title", titleFilter);
    }

    if (typeOfGame && typeOfGame.length > 0) {
      typeOfGame.forEach((filterType) => {
        addFilter("typeOfGame", filterType.value);
      });
    }

    if (theme && theme.length > 0) {
      theme.forEach((filterTheme) => {
        addFilter("theme", filterTheme.value);
      });
    }

    if (releaseYear) {
      addFilter("releaseYear", releaseYear);
    }

    if (editor && editor.length > 0) {
      editor.forEach((filterEditor) => {
        addFilter("editor", filterEditor.value);
      });
    }

    if (typeOfView && typeOfView.length > 0) {
      typeOfView.forEach((filterView) => {
        addFilter("typeOfView", filterView.value);
      });
    }

    if (playingMode && playingMode.length > 0) {
      playingMode.forEach((filterMode) => {
        addFilter("playingMode", filterMode.value);
      });
    }

    if (platform && platform.length > 0) {
      platform.forEach((filterPlatform) => {
        addFilter("platform", filterPlatform.value);
      });
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/games${filtersRequest}`,
      );
      setGames(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getGames = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/games`);
      setGames(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getFilters = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/filters`,
      );
      setFilters(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getGames();
    getFilters();
    setIsLoading(false);
  }, []);

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <h3 className="text-3xl text-white">Games</h3>
        <Link
          to="/add-game"
          className="bg-(--yellow) px-5 py-3 rounded-lg text-xl hover:bg-transparent hover:text-(--yellow) border-2 hover:border-(--yellow)"
        >
          Add game
        </Link>
      </div>
      {isLoading && <img src={LoaderImg} />}
      <details>
        <summary className="text-white border border-white px-2 py-4 bg-[#232222]">
          Filtres
        </summary>
        <form
          onSubmit={handleFilterForm}
          className="text-white border border-white bg-[#232222]"
        >
          <div className="flex flex-wrap">
            <div className="input-text-container w-full lg:w-1/2 2xl:w-1/3">
              <label for="title" className="text-white bg-[#232222] z-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                placeholder="Ex : Call of Duty: Modern Warfare 2"
                onChange={handleTitle}
                value={titleFilter}
              />
            </div>
            <div className="input-text-container w-full lg:w-1/2 2xl:w-1/3">
              <label for="image" className="text-white bg-[#232222] z-1">
                Type of game
              </label>
              <Select
                className="basic-multi-select h-full"
                isMulti
                options={
                  filters?.typeOfGames
                    ? filters.typeOfGames.map((g) => ({
                        value: g.id,
                        label: g.name,
                      }))
                    : []
                }
                value={typeOfGame}
                styles={customStyles}
                onChange={handleTypeOfGame}
                placeholder="Choose game type(s)"
              />
            </div>
            <div className="input-text-container w-full lg:w-1/2 2xl:w-1/3">
              <label for="image" className="text-white bg-[#232222] z-1">
                Theme
              </label>
              <Select
                className="basic-multi-select h-full"
                isMulti
                options={
                  filters?.themes
                    ? filters.themes.map((g) => ({
                        value: g.id,
                        label: g.name,
                      }))
                    : []
                }
                value={theme}
                styles={customStyles}
                onChange={handleTheme}
                placeholder="Choose game theme(s)"
              />
            </div>

            <div className="input-text-container w-full lg:w-1/2 2xl:w-1/3">
              <label for="releaseYear" className="text-white bg-[#232222] z-1">
                Release Year
              </label>
              <input
                type="number"
                id="releaseYear"
                className="h-full"
                placeholder="Ex : 2009"
                onChange={handleReleaseYear}
                value={releaseYear}
              />
            </div>

            <div className="input-text-container w-full lg:w-1/2 2xl:w-1/3">
              <label for="image" className="text-white bg-[#232222] z-1">
                Editor
              </label>
              <Select
                className="basic-multi-select h-full"
                isMulti
                options={
                  filters?.companies
                    ? filters.companies.map((g) => ({
                        value: g.id,
                        label: g.name,
                      }))
                    : []
                }
                styles={customStyles}
                value={editor}
                onChange={handleEditor}
                placeholder="Choose editor(s)"
              />
            </div>

            <div className="input-text-container w-full lg:w-1/2 2xl:w-1/3">
              <label for="image" className="text-white bg-[#232222] z-1">
                Type of View
              </label>
              <Select
                className="basic-multi-select h-full"
                isMulti
                options={
                  filters?.typeOfViews
                    ? filters.typeOfViews.map((g) => ({
                        value: g.id,
                        label: g.name,
                      }))
                    : []
                }
                styles={customStyles}
                value={typeOfView}
                onChange={handleTypeOfView}
                placeholder="Choose type of view(s)"
              />
            </div>

            <div className="input-text-container w-full lg:w-1/2 2xl:w-1/3">
              <label for="image" className="text-white bg-[#232222] z-1">
                Playing Mode
              </label>
              <Select
                className="basic-multi-select h-full"
                isMulti
                options={
                  filters?.playingModes
                    ? filters.playingModes.map((g) => ({
                        value: g.id,
                        label: g.name,
                      }))
                    : []
                }
                styles={customStyles}
                value={playingMode}
                onChange={handlePlayingMode}
                placeholder="Choose playing mode(s)"
              />
            </div>

            <div className="input-text-container w-full lg:w-1/2 2xl:w-1/3">
              <label for="image" className="text-white bg-[#232222] z-1">
                Platform
              </label>
              <Select
                className="basic-multi-select h-full"
                isMulti
                options={
                  filters?.platforms
                    ? filters.platforms.map((g) => ({
                        value: g.id,
                        label: g.name,
                      }))
                    : []
                }
                styles={customStyles}
                value={platform}
                onChange={handlePlatform}
                placeholder="Choose platform(s)"
              />
            </div>
            <div className="p-5 w-full lg:w-1/2 2xl:w-1/3">
              <button className="text-black font-semibold cursor-pointer py-4 bg-(--yellow) w-full h-full rounded-lg">
                Search
              </button>
            </div>
          </div>
        </form>
      </details>
      {games.length > 0 && (
        <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {games.map((game) => {
            return <GameCard key={game.id} game={game} />;
          })}
        </div>
      )}
    </div>
  );
}

export default GamesList;
