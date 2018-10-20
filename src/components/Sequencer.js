import React, { Component } from "react";
import Tone from "tone";
import Track from "./Track";
import Play from "./Play";
import TrackSelect from "./TrackSelect";
import kicktape from "../sounds/kick-tape.wav";
import kick808 from "../sounds/kick-808.wav";
import kickelectro from "../sounds/kick-electro01.wav";
import kickclassic from "../sounds/kick-classic.wav";
import claptape from "../sounds/clap-tape.wav";
import clapfat from "../sounds/clap-fat.wav";
import clapcrushed from "../sounds/clap-crushed.wav";
import clap808 from "../sounds/clap-808.wav";
import hihat808 from "../sounds/hihat-808.wav";
import hihatacoustic1 from "../sounds/hihat-acoustic01.wav";
import hihatelectro from "../sounds/hihat-electro.wav";
import guitarC4 from "../samples/guitar-electric/C4.mp3";
import pianoC4 from "../samples/piano/C4.mp3";
import celloC4 from "../samples/cello/C4.mp3";

export default class Sequencer extends Component {
  state = {
    bpm: 120,
    timer: 0,
    trackActive: false,
    synthActive: true,
    sounds: [
      {
        name: new Tone.Player(kicktape).toMaster(),
        volume: 100,
        mute: false,
        values: [false, false, false, false, false, false, false, false],
        id: "102394",
        color: "#EB5757",
        tones: [kicktape, kick808, kickelectro, kickclassic],
        toneName: ["Kick-Tape", "Kick-808", "Kick-Electro", "Kick-Classic"]
      },
      {
        name: new Tone.Player(claptape).toMaster(),
        volume: 100,
        mute: false,
        values: [false, false, false, false, false, false, false, false],
        id: "10463",
        color: "#6FCF97",
        tones: [claptape, clap808, clapfat, clapcrushed],
        toneName: ["Clap-Tape", "Clap-808", "Clap-Fat", "Clap-Crushed"]
      },
      {
        name: new Tone.Player(hihat808).toMaster(),
        volume: 100,
        mute: false,
        values: [false, false, false, false, false, false, false, false],
        id: "345984",
        color: "#BB6BD9",
        tones: [hihat808, hihatacoustic1, hihatelectro],
        toneName: ["Hihat-808", "Hihat-Acoustic", "Hihat-Electro"]
      }
    ],
    synth: {
      name: new Tone.Sampler(
        {
          C4: pianoC4
        },
        { release: 4 }
      ).toMaster(),
      notes: {
        A: "C3",
        W: "C#3",
        S: "D3",
        E: "D#3",
        D: "E3",
        R: "E#3",
        F: "F3",
        T: "F#3",
        G: "G3",
        Y: "G#3",
        H: "A3",
        U: "A#3",
        J: "B3",
        I: "B#3",
        Z: "C4",
        X: "D4",
        C: "E4",
        V: "F4",
        B: "G4",
        N: "A4",
        M: "B4"
      },
      synthSounds: [pianoC4, guitarC4, celloC4],
      currentSynth: 0
    }
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
    console.log(this.state.bpm);
    this.setState({
      bpm: e.target.value
    });
    Tone.Transport.bpm.value = this.state.bpm;
  };

  selectTuneHandler = (tune, trackNumber) => {
    const sounds = [...this.state.sounds];
    sounds[trackNumber].name = new Tone.Player(tune).toMaster();
    this.setState({
      sounds: sounds
    });
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

  synthPlayHandler = e => {
    const sound = this.state.synth.notes[e.key.toUpperCase()];
    if (e.repeat) {
      return;
    } else {
      this.state.synth.name.triggerAttack(sound);
    }
  };

  releaseSynthHandler = () => {
    this.state.synth.name.triggerRelease();
  };

  changeSynthHandler = () => {
    const synth = { ...this.state.synth };
    if (synth.currentSynth < synth.synthSounds.length - 1) {
      synth.currentSynth++;
    } else {
      synth.currentSynth = 0;
    }
    synth.name = new Tone.Sampler(
      {
        C4: synth.synthSounds[synth.currentSynth]
      },
      { release: 4 }
    ).toMaster();
    this.setState({
      synth: synth
    });
  };

  componentDidMount() {
    //Default BPM
    Tone.Transport.bpm.value = this.state.bpm;
    //Load Sequencer
    Tone.Transport.scheduleRepeat(time => {
      console.log(this.state.sounds[1].values);
      console.log(this.state.timer);
      this.state.sounds.forEach((sound, index) => {
        if (
          sound.values[this.state.timer] &&
          !sound.mute &&
          sound.name.loaded
        ) {
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
      <div
        onKeyDown={this.synthPlayHandler}
        onKeyUp={this.releaseSynthHandler}
        tabIndex="0"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <h1 className="main-title">Tap Music</h1>
        {sounds.map((sound, index) => (
          <div key={sound.id} className="full-track">
            <Track
              values={sound.values}
              activateSound={this.activateSoundHandler}
              trackNumber={index}
              activeTrack={this.state.timer}
              color={sound.color}
              mute={sound.mute}
              muteHandler={this.muteTrackHandler}
            />
            <TrackSelect
              tone={sound.tones}
              selectTune={this.selectTuneHandler}
              trackNumber={index}
              toneName={sound.toneName}
            />
          </div>
        ))}
        <div className="dashboard">
          <div className="drums">
            <p onClick={this.changeSynthHandler}>Drums</p>
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
              max="140"
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
