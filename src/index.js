import * as React from 'react';
import ReactDOM from 'react-dom';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      counter: 0,
      stepNumber: 0,
      xIsNext: true,
      undoDone: false
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      
    });
  }

  jumpTo(step) {
    console.log(step);
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      
    });
  }

  undo() {  
    if (this.state.stepNumber <= 0){
      return
    }
    let step = this.state.stepNumber--;
    this.setState({
      stepNumber:  this.state.stepNumber,
      xIsNext: (step % 2) === 0,
      
    });
  }
  
  redo() {
    if (this.state.stepNumber >= this.state.history.length - 1){
      return
    }
   let step = this.state.stepNumber++;
    this.setState({
      stepNumber:  this.state.stepNumber,
      xIsNext: (step % 2) === 0,
      
    });
  }

  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (!current.squares.includes(null)){
      status= 'Draw';
    }
    else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (


      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        
        <div className="game-info">
          <div>{status}</div>
          <div>
          {/* <button onClick={() => this.undo()}>Undo</button>
          <button onClick={() => this.redo()}>Redo</button> */}
      <Stack direction="row" spacing={1}>
      <IconButton aria-label="Undo" onClick={() => this.undo()}>
        <UndoIcon />
      </IconButton>

      <IconButton aria-label="Redo" onClick={() => this.redo()}>
            <RedoIcon/>
      </IconButton>
      </Stack>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
