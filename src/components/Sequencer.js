import React, { Component } from "react";
import Tone from "tone";
import Track from "./Track";
import Play from "./Play";
import kicksound from "../sounds/kick-tape.wav";
import clapsound from "../sounds/clap-tape.wav";
import hihatsound from "../sounds/hihat-808.wav";

export default class Sequencer extends Component {
  state = {
    bpm: 120,
    timer: 0,
    trackActive: false,
    sounds: [
      {
        name: new Tone.Player(kicksound).toMaster(),
        volume: 100,
        mute: false,
        values: [false, false, false, false, false, false, false, false],
        id: "102394",
        track: "Kick",
        color: "#EB5757"
      },
      {
        name: new Tone.Player(clapsound).toMaster(),
        volume: 100,
        mute: false,
        values: [false, false, false, false, false, false, false, false],
        id: "10463",
        track: "Clap",
        color: "#6FCF97"
      },
      {
        name: new Tone.Player(hihatsound).toMaster(),
        volume: 100,
        mute: false,
        values: [false, false, false, false, false, false, false, false],
        id: "345984",
        track: "HiHat",
        color: "#BB6BD9"
      }
    ]
  };

  activateSoundHandler = (sound, trackNumber) => {
    const sounds = [...this.state.sounds];
    sounds[trackNumber].values[sound] = !sounds[trackNumber].values[sound];
    this.setState({
      sounds: sounds
    });
  };

  muteTrackHandler = trackNumber => {
    const sounds = [...this.state.sounds];
    sounds[trackNumber].mute = !sounds[trackNumber].mute;
    this.setState({
      sounds: sounds
    });
  };

  changeBpmHandler = e => {
    this.setState({
      bpm: e.target.value
    });
    Tone.Transport.bpm.value = this.state.bpm;
  };

  activateSongHandler = () => {
    //Start/Stop Sequence
    if (!this.state.trackActive) {
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
    }

    //Switch Play/Stop
    this.setState({
      trackActive: !this.state.trackActive
    });
  };

  componentDidMount() {
    //Default BPM
    Tone.Transport.bpm.value = this.state.bpm;
    //Load Sequencer
    Tone.Transport.scheduleRepeat(time => {
      this.state.sounds.forEach((sound, index) => {
        if (sound.values[this.state.timer] && !sound.mute) {
          sound.name.start();
        }
      });
      //Start Visual Sequence
      this.setState({
        timer: (this.state.timer + 1) % 8
      });
    }, "8n");
  }

  render() {
    const { sounds } = this.state;
    return (
      <div>
        <h1 className="main-title">Tap Music</h1>
        {sounds.map((sound, index) => (
          <Track
            values={sound.values}
            key={sound.id}
            activateSound={this.activateSoundHandler}
            trackNumber={index}
            activeTrack={this.state.timer}
            trackName={sound.track}
            color={sound.color}
            mute={sound.mute}
            muteHandler={this.muteTrackHandler}
          />
        ))}
        <div className="dashboard">
          <div className="drums">
            <p>Drums</p>
          </div>
          <Play
            activateSong={this.activateSongHandler}
            trackActive={this.state.trackActive}
          />
          <div className="tempo">
            <p>Tempo</p>
            <input
              type="range"
              min="0"
              max="150"
              value={this.state.bpm}
              onChange={this.changeBpmHandler}
              onClick={e => e.preventDefault()}
            />
            <p>{this.state.bpm}</p>
          </div>
        </div>
      </div>
    );
  }
}
