import { useEffect, useState } from 'react'
import {
  checkEndGame,
  checkWinnerFrom,
  nextTurn,
  provideInitialArray,
  provideDefaultTurn
} from './logic/board'
import { createConfetti, resetConfetti } from './logic/confetti'
import {
  resetGameStorage,
  saveGameToStorage
} from './logic/storage'
import { BoardTile } from './components/BoardTile'

function App() {
  const [board, setBoard] = useState(provideInitialArray)
  const [turn, setTurn] = useState(provideDefaultTurn)
  const [winner, setWinner] = useState(null)
  const [winnerCombo, setWinnerCombo] = useState(null)

  // Player name state
  const [player1Name, setPlayer1Name] = useState('')
  const [player2Name, setPlayer2Name] = useState('')
  const [isGameStarted, setIsGameStarted] = useState(false)

  const handleReset = () => {
    setBoard(provideInitialArray)
    setTurn(provideDefaultTurn)
    setWinner(null)
    setWinnerCombo(null)
    resetConfetti()
    resetGameStorage()
    setIsGameStarted(false) // Reset game state
  }

  const canBoardBeUpdated = (index) => board[index] === null && winner === null

  const updateBoardTile = (index, value) => {
    const newBoard = [...board]
    newBoard[index] = value
    setBoard(newBoard)
    return newBoard
  }

  const onBoardTileAction = (index) => {
    if (!canBoardBeUpdated(index)) return
    const newBoard = updateBoardTile(index, turn)
    const newTurn = nextTurn(turn)
    setTurn(newTurn)
    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    })
  }

  useEffect(() => {
    const [newWinner, newWinnerCombo] = checkWinnerFrom(board)
    if (newWinner !== null) {
      createConfetti()
      setWinner(newWinner)
      setWinnerCombo(newWinnerCombo)
    } else if (checkEndGame(board)) {
      setWinner(false) // tie
    }
  }, [board])

  const handleStartGame = () => {
    if (player1Name.trim() && player2Name.trim()) {
      setIsGameStarted(true)
    } else {
      alert('Please enter names for both players before starting the game!')
    }
  }

  const currentPlayerName = turn === 'X' ? player1Name : player2Name

  return (
    <main className="App">
      <header>
        <a href="./" className="branding">
          <img src="tic-tac-toe.svg" className="logo" alt="Tic-Tac-Toe logo" />
          <h1 className="title">
            <span>Tic</span>-<span>Tac</span>-<span>Toe</span>
          </h1>
        </a>
      </header>

      {!isGameStarted ? (
        <section className="player-input">
          <h2>Enter Player Names</h2>
          <label>
            Player 1 (X):
            <input
              type="text"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              placeholder="Enter Player 1 Name"
            />
          </label>
          <label>
            Player 2 (O):
            <input
              type="text"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              placeholder="Enter Player 2 Name"
            />
          </label>
          <button onClick={handleStartGame}>Start Game</button>
        </section>
      ) : (
        <>
          <section className="board">
            {board.map((value, index) => (
              <BoardTile
                key={index}
                value={value}
                action={onBoardTileAction}
                index={index}
                highlight={winnerCombo?.includes(index)}
              />
            ))}
          </section>
          <footer>
            <button onClick={handleReset}>Reset</button>
            {winner === null && (
              <p>
                <span>{currentPlayerName}</span>'s turn
              </p>
            )}
            {winner === false && <p>TIE!</p>}
            {winner && (
              <p>
                <span>{winner === 'X' ? player1Name : player2Name}</span> won!
              </p>
            )}
          </footer>
        </>
      )}
      {/* Footer for credits */}
      <footer className="credits">
        <p>Developed by <span>Ishan</span></p>
      </footer>
    </main>
  )
}

export default App
