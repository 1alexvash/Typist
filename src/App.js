import React, { Component } from "react";
import "./scss/main.css";
import levels from "./levels";
import successSound from "./sounds/sound_success.mp3";
import mistakeSound from "./sounds/sound_failure.mp3";

const successMelody = new Audio(successSound);
const mistakeMelody = new Audio(mistakeSound);

class App extends Component {
  state = {
    isPlaying: false,
    level: "",
    randomCharacter: "",
    inputData: "",
    score: 0,
    multiplier: null,
    totalScore: 0
  };

  componentDidMount() {
    if (localStorage.totalScore !== undefined) {
      let totalScore = JSON.parse(localStorage.totalScore);
      this.setState({ totalScore });
    }
  }

  updateTotalScore(value) {
    let { totalScore } = this.state;
    totalScore = totalScore + value;
    localStorage.totalScore = JSON.stringify(totalScore);
    this.setState({ totalScore });
  }

  startTyping(level, multiplier) {
    this.setState({ isPlaying: true, multiplier, level }, () => {
      this.generateRandomCharacter();
      this.refs.myInput.focus();
    });
  }

  generateRandomCharacter() {
    const string = this.state.level;
    let random = Math.floor(Math.random() * string.length);
    let randomCharacter = string[random];
    this.setState({ randomCharacter });
  }

  inputTyping(e) {
    let { randomCharacter, score, multiplier } = this.state;

    let character = e.target.value;
    if (character === randomCharacter) {
      score = score + 5 * multiplier;
      successMelody.play();
      successMelody.currentTime = 0;
      this.setState({ score }, () => this.generateRandomCharacter());
    } else {
      score = score - 5 * multiplier;
      mistakeMelody.play();
      mistakeMelody.currentTime = 0;
      this.setState({ score });
    }
  }

  returnBack() {
    let { score } = this.state;
    this.updateTotalScore(score);
    this.setState({ score: 0, isPlaying: false });
  }

  render() {
    const {
      isPlaying,
      randomCharacter,
      inputData,
      score,
      totalScore
    } = this.state;
    return (
      <div className="App">
        {isPlaying ? (
          <div className="game">
            <div className="zoom">
              <div className="block" title="Type this character">
                <div className="symbol">{randomCharacter}</div>
              </div>
            </div>
            <input
              type="text"
              className="input"
              autocapitalize="off"
              value={inputData}
              ref="myInput"
              onChange={e => this.inputTyping(e)}
            />
            <div className="score">
              Score: <b>{score}</b>
            </div>
            <div className="return-back">
              <button onClick={() => this.returnBack()}>Return back</button>
            </div>
          </div>
        ) : (
          <div className="menu">
            <h1 className="heading">
              Start Typing
              <p>Mood:</p>
            </h1>
            <div className="levels">
              <button onClick={() => this.startTyping(levels.easy, 2)}>
                Easy
              </button>
              <button onClick={() => this.startTyping(levels.medium, 3)}>
                Medium
              </button>
              <button onClick={() => this.startTyping(levels.hard, 4)}>
                Hard
              </button>
              <button onClick={() => this.startTyping(levels.nightmare, 5)}>
                Nightmare
              </button>
            </div>
            {totalScore !== 0 ? (
              <div className="total-score">
                Your total score: <b>{totalScore}</b>
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  }
}

export default App;
