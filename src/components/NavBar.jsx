import { useState } from "react";
import { Link } from "react-router-dom";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="relative text-white">
      <div className="navbar flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-3xl">RezGame</h1>
        </div>

        <div className="menu-links hidden md:flex gap-6 items-center">
          <Link to="/">Home</Link>
          <Link to="/games">All games</Link>
          <Link to="/guess-game">GameGuess</Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col gap-1.5 cursor-pointer w-6"
        >
          <span
            className={`h-0.5 bg-white transition-transform duration-300 ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`h-0.5 bg-white transition-opacity duration-150 ${
              isOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`h-0.5 bg-white transition-transform duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-[#1a1a1a] ${
          isOpen ? "max-h-60" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-4 p-6">
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>
          <Link to="/games" onClick={closeMenu}>
            All games
          </Link>
          <Link to="/guess-game" onClick={closeMenu}>
            GameGuess
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;