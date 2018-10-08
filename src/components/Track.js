import React, { Component } from "react";

export default class Track extends Component {
  render() {
    return (
      <div className="track-container">
        <div className="track">
          <h3>{this.props.trackName}</h3>
          <svg
            onClick={() => this.props.muteHandler(this.props.trackNumber)}
            width="70"
            height="70"
            viewBox="0 0 70 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="35"
              cy="35"
              r="32.5"
              fill={this.props.mute ? "white" : this.props.color}
              stroke={this.props.color}
              strokeWidth="5"
              style={{ transition: "all 0.5s ease" }}
            />
          </svg>
        </div>
        <div>
          {this.props.values.map((value, index) => (
            <svg
              key={index}
              width="100"
              height="100"
              style={{
                fill: value ? this.props.color : "rgb(220,220,220)",
                transform:
                  index === this.props.activeTrack
                    ? "scaleY(1.1)"
                    : "scaleX(1)",
                strokeWidth: "3px",
                margin: "10px",
                transition: "all 0.5s ease"
              }}
              onClick={() =>
                this.props.activateSound(index, this.props.trackNumber)
              }
            >
              <rect width="100" height="100" />
            </svg>
          ))}
        </div>
      </div>
    );
  }
}
