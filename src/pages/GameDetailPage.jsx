import axios from "axios";
import LoaderImg from "../assets/loading.gif";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DetailRow from "../components/DetailRow";
import { Box, Rating } from "@mui/material";

function GameDetailPage() {
  const [game, setGame] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const navigate = useNavigate();

  const [titleForm, setTitleForm] = useState("");
  const [ratingForm, setRatingForm] = useState(2.5);
  const [hover, setHover] = useState(-1);
  const [descriptionForm, setDescriptionForm] = useState("");

  const handleTitleForm = (e) => {
    setTitleForm(e.target.value);
  };

  const handleDescription = (e) => {
    setDescriptionForm(e.target.value);
  };

  const { gameId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const labels = {
    0: "Unplayable",
    0.5: "Unplayable",
    1: "Poor",
    1.5: "Weak",
    2: "Mediocre",
    2.5: "Average",
    3: "Decent",
    3.5: "Good",
    4: "Great",
    4.5: "Excellent",
    5: "Masterpiece",
  };

  function getLabelText(value) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
  }

  const getGame = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/games/${gameId}?_embed=ratings`,
      );
      console.log("response", response);
      const statusCode = response.status;
      console.log("Code de retour :", statusCode);
      setGame(response.data);
      if (response.data.ratings.length > 0) {
        let averageValue =
          response.data.ratings.reduce((acc, rating) => {
            return acc + Number(rating["rating"]);
          }, 0) / response.data.ratings.length;
        setAverageRating(averageValue.toFixed(1));
      } else {
        setAverageRating(0);
      }
      setIsLoading(false);
    } catch (e) {
      if(e.response && e.response.status === 404){
        navigate('/notfound');
      }
      console.log("error", e.response);
    }
  };

  const deleteGame = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/games/${gameId}`);
      navigate("/games");
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = () => {
    deleteGame();
  };

  const handleRatingForm = async (e) => {
    e.preventDefault();

    let body = {
      title: titleForm,
      rating: parseFloat(ratingForm),
      description: descriptionForm,
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      gameId,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/ratings`,
        body,
      );

      let newRatingArray = [...(game.ratings || []), response.data];

      setGame((prevGame) => ({
        ...prevGame,
        ratings: newRatingArray,
      }));

      let ratingValue =
        newRatingArray.reduce((acc, rating) => {
          return acc + Number(rating["rating"]);
        }, 0) / newRatingArray.length;

      setAverageRating(ratingValue.toFixed(1));
    } catch (e) {
      console.log("Error during the rating form :", e);
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
        <div className="flex flex-col md:flex-row gap-6 w-full">
          <div className="w-48 shrink-0">
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
                <button
                  onClick={handleDelete}
                  className="text-red-700 px-3 rounded-lg bg-neutral-900 border border-red-700 cursor-pointer"
                >
                  <i className="bi bi-trash3"></i>
                </button>
              </div>
            </div>
            {game?.ratings.length > 0 && (
              <div className="my-2">
                <Box spacing={1} className="flex flex-row">
                  <Rating
                    name="read-only"
                    value={averageRating}
                    precision={0.1}
                    readOnly
                  />
                  <div className="ms-2">{averageRating} / 5</div>
                  <Box sx={{ ml: 2 }}>( {game?.ratings.length} )</Box>
                </Box>
              </div>
            )}
            <p className="text-neutral-400">{game.releaseYear}</p>
            <p className="text-neutral-400">
              {game.editor.map((e) => e.name).join(", ")}
            </p>
          </div>
        </div>

        {/* Bloc détails, une sous-fiche plus claire */}
        <div className="bg-neutral-700 rounded-lg p-4 mt-6 space-y-3">
          <DetailRow label="Type of Game" items={game.typeOfGame} />
          <DetailRow label="Theme" items={game.theme} />
          <DetailRow label="Type of Viewx" items={game.typeOfView} />
          <DetailRow label="Playing mode" items={game.playingMode} />
          <DetailRow label="Platforms" items={game.platform} />
        </div>
        <div className="bg-neutral-700 rounded-lg p-4 mt-6 space-y-3">
          <h4 className="text-xl">Add Rating</h4>
          <form
            onSubmit={handleRatingForm}
            className="flex flex-wrap border border-s-white rounded-lg bg-neutral-800"
          >
            <div className="input-text-container w-full">
              <label htmlFor="titleForm" className="text-white bg-neutral-800">
                Title
              </label>
              <input
                type="text"
                id="titleForm"
                placeholder="Ex : Great game"
                onChange={handleTitleForm}
                value={titleForm}
              />
            </div>
            <div className="px-5 w-full">
              <label className="text-white">Rating</label>
              <Box spacing={1} className="flex flex-row">
                <Rating
                  name="hover-feedback"
                  value={ratingForm}
                  precision={0.5}
                  getLabelText={getLabelText}
                  onChange={(event, newValue) => {
                    setRatingForm(newValue);
                  }}
                  onChangeActive={(event, newHover) => {
                    setHover(newHover);
                  }}
                />
                {ratingForm !== null && (
                  <Box sx={{ ml: 2 }}>
                    {labels[hover !== -1 ? hover : ratingForm]}
                  </Box>
                )}
              </Box>
            </div>
            <div className="input-text-container w-full">
              <label
                htmlFor="descriptionForm"
                className="text-white bg-neutral-800"
              >
                Description
              </label>
              <textarea
                id="descriptionForm"
                placeholder="Ex : Great game"
                onChange={handleDescription}
                value={descriptionForm}
              />
            </div>
            <button className="flex mb-5 me-5 ms-auto py-2 px-4 bg-(--yellow) rounded-lg border-2 border-(--yellow) text-black cursor-pointer hover:bg-neutral-800 hover:text-(--yellow) ">
              Publish
            </button>
          </form>
        </div>
        <div className="bg-neutral-700 rounded-lg p-4 mt-6 space-y-3">
          <h4 className="text-xl">Ratings ({game?.ratings.length}) </h4>
          <div className="flex flex-col gap-y-4">
            {game?.ratings.length === 0 && (
              <p className="text-xl text-(--yellow)">
                Be the first one to put a rating on this game
              </p>
            )}
            {game?.ratings.length > 0 &&
              game.ratings.map((rating) => {
                return (
                  <div className="border border-s-white rounded-lg bg-neutral-800 p-4">
                    <div className="flex flex-row items-center justify-between w-full">
                      <p className="text-xl">{rating.title}</p>
                      <p className="text-neutral-400 text-sm">
                        {rating.createdAt} by User
                      </p>
                    </div>

                    <Rating
                      name="read-only"
                      className="my-2"
                      value={rating.rating}
                      precision={0.5}
                      readOnly
                    />
                    <p>{rating.description}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameDetailPage;
