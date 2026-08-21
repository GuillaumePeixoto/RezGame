import { Link } from "react-router-dom";

function NavBar() {


    return (
        <nav>
            <div className="navbar">
                <div>
                    <h1 className="text-3xl">RezGame</h1>
                </div>
                <div className="menu-links">
                    <Link to="/">
                        Home
                    </Link>
                    <Link to="/games">
                        All games
                    </Link>
                    <Link>
                        GameGuess
                    </Link>
                    {/* Bouton connexion et inscription / si connecté alors icon user */}
                </div>
            </div>
        </nav>
    )
}

export default NavBar;