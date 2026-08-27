import "./App.css";
import "keen-slider/keen-slider.min.css";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GamesList from "./pages/GamesList";
import FormGame from "./pages/FormGame";
import GameDetailPage from "./pages/GameDetailPage";
import GuessGame from "./pages/GuessGame";
import Footer from "./components/Footer";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <>
      <NavBar />
      <div className="flex flex-col sm:w-5/6 lg:w-3/4 mx-4 sm:mx-auto py-4 main-content">
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/games" element={<GamesList />}></Route>
          <Route path="/games/:gameId" element={<GameDetailPage />}></Route>
          <Route path="/games/update/:gameId" element={<FormGame />}></Route>
          <Route path="/guess-game" element={<GuessGame />}></Route>
          <Route path="/add-game" element={<FormGame />}></Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer></Footer>
    </>
  );
}

export default App;
