import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

interface SquareProps {
  onClick(i: React.MouseEvent): void; 
  value: string;
};

function Square(props: SquareProps) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

interface BoardProps {
  onClick(i: number): void; 
  squares: Array<string>;
};

class Board extends React.Component<BoardProps> {
  constructor(props: BoardProps) {
    super(props);
  }

  renderSquare(i: number) {
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
        {
          [0,1,2].map((i) =>
            <div className="board-row">
              {
                [0,1,2].map((j) => this.renderSquare(j + i*3))
              }
            </div>
          )
        }
      </div>
    );
  }
}

interface HistoryElement {
  squares: Array<string>;
  xIsNext: boolean;
}

interface GameState {
  history: Array<HistoryElement>;
  stepNumber: number;
};

class Game extends React.Component<{}, GameState> {
  readonly state: GameState = {
    history: [{
      squares: Array(9).fill(null),
      xIsNext: true,
    }],
    stepNumber: 0,
  };

  constructor(props: any) {
    super(props);
  }

  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const xIsNext = current.xIsNext;
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? 'X' : 'O';
    const newHistory: Array<HistoryElement> = history.concat([{
      squares: squares,
      xIsNext: !xIsNext,
    }]);

    this.setState({
      history: newHistory,
      stepNumber: history.length,
    });
  }

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const xIsNext = current.xIsNext;

    const moves = history.map( (_: any, moveNum: number) => {
      const desc = moveNum ?
        'Go to move # ' + moveNum :
        'Go to game start';
      return(
        <li key={moveNum}>
          <button onClick={() => this.jumpTo(moveNum)}>{desc}</button>
        </li>
      );
    });

    let status;
    const winner = calculateWinner(current.squares);
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game  />,
  document.getElementById('root')
);


function calculateWinner(squares: Array<string>) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
