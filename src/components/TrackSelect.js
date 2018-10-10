import React, { Component, Fragment } from "react";

export default class TrackSelect extends Component {
  render() {
    return (
      <Fragment>
        <select
          className="track-select"
          onClick={e =>
            this.props.selectTune(e.target.value, this.props.trackNumber)
          }
        >
          {this.props.tone.map((tone, index) => (
            <option value={tone} key={index}>
              {this.props.toneName[index]}
            </option>
          ))}
        </select>
      </Fragment>
    );
  }
}
