import { useRef } from "react";

function GameCard(props) {
  const posterRef = useRef(null);

  const handleMouseMove = (e) => {
    const poster = posterRef.current;
    const rect = poster.getBoundingClientRect();
    poster.style.transition = "none";

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 15;
    const rotateX = -((y - centerY) / centerY) * 15;

    poster.style.transform = `
      translateZ(30px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.05)
    `;
  };

  const handleMouseLeave = () => {
    posterRef.current.style.transform =
      "translateZ(0) rotateX(0) rotateY(0) scale(1)";
    posterRef.current.style.transition = "transform 0.3s ease"; // transition uniquement au retour
    posterRef.current.style.transform = "translateZ(0) rotateX(0) rotateY(0) scale(1)";
  };

  return (
    <div className="card-wrapper">
      <div
        ref={posterRef}
        className="poster"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ background: `url(${props.game.image}) no-repeat center` }}
      >
        {props.game.title}
      </div>
    </div>
  );
}

export default GameCard;
