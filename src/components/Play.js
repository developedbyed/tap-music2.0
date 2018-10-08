import React from "react";
import play from "../svg/play.svg";
import stop from "../svg/stop.svg";

export default ({ activateSong, trackActive }) => {
  return (
    <div className="play-container">
      <button className="playButton" onClick={activateSong}>
        {trackActive ? (
          <img className="play" src={stop} alt="" />
        ) : (
          <img className="play" src={play} alt="play" />
        )}
      </button>
    </div>
  );
};
