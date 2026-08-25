import axios from "axios";
import LoaderImg from "../assets/loading.gif";
import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import { Link, useSearchParams } from "react-router-dom";
import Select from "react-select";
import { customStyles } from "../styles/selectStyleReact";

function GamesList() {
  const [games, setGames] = useState([]);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

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

  let arrayOfFiltersFromURL = [
    {
      nameFromURL: "typeOfGame",
      nameFromFilters: "typeOfGames",
      setterInput: setTypeOfGame,
    },
    {
      nameFromURL: "theme",
      nameFromFilters: "themes",
      setterInput: setTheme,
    },
    {
      nameFromURL: "typeOfView",
      nameFromFilters: "typeOfViews",
      setterInput: setTypeOfView,
    },
    {
      nameFromURL: "playingMode",
      nameFromFilters: "playingModes",
      setterInput: setPlayingMode,
    },
    {
      nameFromURL: "platform",
      nameFromFilters: "platforms",
      setterInput: setPlatform,
    },
  ];

  const updateFiltersFromURL = () => {
    if (!filters || !filters?.typeOfGames) {
      return;
    }
    for (const [key, value] of searchParams) {
      if (key === "releaseYear") {
        setReleaseYear(value);
        continue;
      }
      if (key === "title") {
        setTitleFilter(value);
        continue;
      }

      let filtersKey = arrayOfFiltersFromURL.find(
        (filter) => filter.nameFromURL === key,
      );

      if (!filtersKey) {
        continue;
      }

      let valueFilterFromURL = filters[filtersKey.nameFromFilters].find(
        (filterValue) => filterValue.id === value,
      );

      if (!valueFilterFromURL) {
        continue; // id présent dans l'URL mais introuvable dans filters
      }

      const formattedValue = {
        value: valueFilterFromURL.id,
        label: valueFilterFromURL.name,
      };

      filtersKey.setterInput((filterValueList) => [
        ...filterValueList,
        formattedValue,
      ]);
    }
  };

  const buildParamsObject = () => {
    const params = {};

    if (titleFilter) params.title = titleFilter;
    if (typeOfGame.length > 0)
      params.typeOfGame = typeOfGame.map((f) => f.value);
    if (theme.length > 0) params.theme = theme.map((f) => f.value);
    if (releaseYear) params.releaseYear = releaseYear;
    if (editor.length > 0) params.editor = editor.map((f) => f.value);
    if (typeOfView.length > 0)
      params.typeOfView = typeOfView.map((f) => f.value);
    if (playingMode.length > 0)
      params.playingMode = playingMode.map((f) => f.value);
    if (platform.length > 0) params.platform = platform.map((f) => f.value);

    return params;
  };

  const handleFilterForm = async (e) => {
    e.preventDefault();
    let filtersRequestQuery = createQueryFilter();
    getGames(filtersRequestQuery);
    setSearchParams(buildParamsObject());
  };

  const createQueryFilter = () => {
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

    return filtersRequest;
  };

  const getGames = async (queryString = "") => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/games${queryString}`,
      );
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

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getFilters();
  }, []);

  useEffect(() => {
    updateFiltersFromURL();

    const query = searchParams.toString();
    getGames(query ? `?${query}` : "");

    setIsLoading(false);
  }, [filters]);

  return (
    <div className="p-5 bg-neutral-800 rounded-lg">
      <div className="mb-4 flex justify-between">
        <h3 className="text-3xl text-white self-center">Games</h3>
        <Link
          to="/add-game"
          className="bg-(--yellow) px-5 py-3 rounded-lg text-xl hover:bg-transparent hover:text-(--yellow) border-2 hover:border-(--yellow)"
        >
          Add game
        </Link>
      </div>
      {isLoading && <img src={LoaderImg} />}
      <div className="border border-white bg-[#232222]">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex justify-between items-center text-white px-4 py-4 cursor-pointer"
        >
          Filters
          <i
            className={`bi bi-chevron-down transition-transform duration-800 ${
              showFilters ? "rotate-180" : ""
            }`}
          ></i>
        </button>

        <div
          className={`overflow-hidden transition-all duration-1200 ${
            showFilters ? "max-h-250" : "max-h-0"
          }`}
        >
          <form
            onSubmit={handleFilterForm}
            className="text-white border border-white bg-[#232222]"
          >
            <div className="flex flex-wrap">
              <div className="input-text-container w-full lg:w-1/2 2xl:w-1/3">
                <label htmlFor="title" className="text-white bg-[#232222] z-1">
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
                <label htmlFor="image" className="text-white bg-[#232222] z-1">
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
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  onChange={handleTypeOfGame}
                  placeholder="Choose game type(s)"
                />
              </div>
              <div className="input-text-container w-full lg:w-1/2 2xl:w-1/3">
                <label htmlFor="image" className="text-white bg-[#232222] z-1">
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
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  onChange={handleTheme}
                  placeholder="Choose game theme(s)"
                />
              </div>

              <div className="input-text-container w-full lg:w-1/2 2xl:w-1/3">
                <label
                  htmlFor="releaseYear"
                  className="text-white bg-[#232222] z-1"
                >
                  Release Year
                </label>
                <input
                  type="number"
                  id="releaseYear"
                  className="h-full"
                  placeholder="Ex : 2009"
                  min="1970"
                  onChange={handleReleaseYear}
                  value={releaseYear}
                />
              </div>

              <div className="input-text-container w-full lg:w-1/2 2xl:w-1/3">
                <label htmlFor="image" className="text-white bg-[#232222] z-1">
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
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  onChange={handleEditor}
                  placeholder="Choose editor(s)"
                />
              </div>

              <div className="input-text-container w-full lg:w-1/2 2xl:w-1/3">
                <label htmlFor="image" className="text-white bg-[#232222] z-1">
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
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  placeholder="Choose type of view(s)"
                />
              </div>

              <div className="input-text-container w-full lg:w-1/2 2xl:w-1/3">
                <label htmlFor="image" className="text-white bg-[#232222] z-1">
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
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  onChange={handlePlayingMode}
                  placeholder="Choose playing mode(s)"
                />
              </div>

              <div className="input-text-container w-full lg:w-1/2 2xl:w-1/3">
                <label htmlFor="image" className="text-white bg-[#232222] z-1">
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
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
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
        </div>
      </div>

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
