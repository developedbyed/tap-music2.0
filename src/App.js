import React, { Component } from "react";
import "./App.css";
import Sequencer from "./components/Sequencer";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Sequencer />
      </div>
    );
  }
}

export default App;
