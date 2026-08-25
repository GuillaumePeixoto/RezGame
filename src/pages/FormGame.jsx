import axios from "axios";
import LoaderImg from "../assets/loading.gif";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { customStyles } from '../styles/selectStyleReact';


function FormGame() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [filtersList, setFiltersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  let titlePage = "Add a Game";
  let isUpdate = false;

  if (gameId) {
    titlePage = "Update a Game";
    isUpdate = true;
  }

  const getGame = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/games/${gameId}`,
      );
      let gameData = response.data;
      setTitle(gameData.title || "");
      setImage(gameData.image || "");
      setTypeOfGame(formatDataForSelectFromBDD(gameData.typeOfGame) || []);
      setTheme(formatDataForSelectFromBDD(gameData.theme) || "");
      setTypeOfView(formatDataForSelectFromBDD(gameData.typeOfView) || []);
      setReleaseYear(gameData.releaseYear || "");
      setPlayingMode(formatDataForSelectFromBDD(gameData.playingMode) || []);
      setEditor(formatDataForSelectFromBDD(gameData.editor) || []);
      setPlatform(formatDataForSelectFromBDD(gameData.platform) || []);
    } catch (e) {
      console.log("get game error: ",e);
    }
  };

  const getFilters = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/filters`,
      );
      setFiltersList(response.data);
    } catch (e) {
      console.log("Get filters error: ",e);
    }
  };

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [typeOfGame, setTypeOfGame] = useState([]);
  const [theme, setTheme] = useState("");
  const [typeOfView, setTypeOfView] = useState([]);
  const [releaseYear, setReleaseYear] = useState("");
  const [playingMode, setPlayingMode] = useState([]);
  const [editor, setEditor] = useState([]);
  const [platform, setPlatform] = useState([]);

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleImage = (e) => {
    setImage(e.target.value);
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

  const transformMultiValuesForAPI = (arr) => {
    return arr.map((item) => item.value);
  };

  const formatDataForSelectFromBDD = (arr) => {
    if (!arr) return [];
    return arr.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  };

  const addNewSpecValue = async (selectedValues, gameSpec) => {
    const results = [];
    for (const item of selectedValues) {
      if (item.__isNew__) {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/${gameSpec}`,
          {
            name: item.label,
          },
        );
        results.push(response.data.id);
      } else {
        results.push(item.value);
      }
    }
    return results;
  };

  const handleForm = async (e) => {
    e.preventDefault();

    let editorValues = await addNewSpecValue(editor, "companies");

    let body = {
      title,
      image,
      typeOfGame: transformMultiValuesForAPI(typeOfGame),
      theme: transformMultiValuesForAPI(theme),
      releaseYear,
      typeOfView: transformMultiValuesForAPI(typeOfView),
      playingMode: transformMultiValuesForAPI(playingMode),
      editor: editorValues,
      platform: transformMultiValuesForAPI(platform),
    };

    try {
      if(gameId){
        await axios.put(`${import.meta.env.VITE_API_URL}/games/${gameId}`, body);
        navigate(`/games/${gameId}`);
      }else{
        await axios.post(`${import.meta.env.VITE_API_URL}/games`, body);
        navigate("/games");
      }
    } catch (e) {
      console.log(e);
    }

  };

  useEffect(() => {
    getFilters();
    if (gameId) {
      getGame();
    }
    setIsLoading(false);
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
    <div className="bg-[#232222] p-4 rounded-2xl">
      <div>
        <h2 className="text-4xl text-white px-6 mt-2">{titlePage}</h2>
      </div>
      <form onSubmit={handleForm} className="flex flex-wrap">
        <div className="input-text-container w-full lg:w-1/2 2xl:w-1/3">
          <label htmlFor="title" className="text-white bg-[#232222] z-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="Ex : Call of Duty: Modern Warfare 2"
            onChange={handleTitle}
            value={title}
          />
        </div>
        <div className="input-text-container w-full lg:w-1/2 2xl:w-1/3">
          <label htmlFor="image" className="text-white bg-[#232222] z-1">
            Image URL
          </label>
          <input
            type="text"
            id="image"
            placeholder="Ex : https://example.com/image.png"
            onChange={handleImage}
            value={image}
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
              filtersList?.typeOfGames
                ? filtersList.typeOfGames.map((g) => ({
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
          <label htmlFor="image" className="text-white bg-[#232222] z-1">
            Theme
          </label>
          <Select
            className="basic-multi-select h-full"
            isMulti
            options={
              filtersList?.themes
                ? filtersList.themes.map((g) => ({
                    value: g.id,
                    label: g.name,
                  }))
                : []
            }
            value={theme}
            styles={customStyles}
            onChange={handleTheme}
            placeholder="Choose theme(s)"
          />
        </div>

        <div className="input-text-container w-full lg:w-1/2 2xl:w-1/3">
          <label htmlFor="releaseYear" className="text-white bg-[#232222] z-1">
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
          <label htmlFor="image" className="text-white bg-[#232222] z-1">
            Editor
          </label>
          <CreatableSelect
            className="basic-multi-select h-full"
            isMulti
            options={
              filtersList?.companies
                ? filtersList.companies.map((g) => ({
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
          <label htmlFor="image" className="text-white bg-[#232222] z-1">
            Type of View
          </label>
          <Select
            className="basic-multi-select h-full"
            isMulti
            options={
              filtersList?.typeOfViews
                ? filtersList.typeOfViews.map((g) => ({
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
          <label htmlFor="image" className="text-white bg-[#232222] z-1">
            Playing Mode
          </label>
          <Select
            className="basic-multi-select h-full"
            isMulti
            options={
              filtersList?.playingModes
                ? filtersList.playingModes.map((g) => ({
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
          <label htmlFor="image" className="text-white bg-[#232222] z-1">
            Platform
          </label>
          <Select
            className="basic-multi-select h-full"
            isMulti
            options={
              filtersList?.platforms
                ? filtersList.platforms.map((g) => ({
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

        <div className="input-text-container w-full lg:w-1/2 2xl:w-1/3 mx-auto">
          <button className="w-full h-full min-h-14 text-xl bg-(--yellow) rounded-lg cursor-pointer">
            {isUpdate ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormGame;
