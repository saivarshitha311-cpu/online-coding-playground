import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw, X, Circle } from "lucide-react";
import './TicTacToe.css';

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<string[][]>([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const [userSymbol, setUserSymbol] = useState<string | null>(null);
  const [computerSymbol, setComputerSymbol] = useState<string | null>(null);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [showSymbolSelection, setShowSymbolSelection] = useState<boolean>(true);

  const startGame = (symbol: string) => {
    setUserSymbol(symbol);
    setComputerSymbol(symbol === 'X' ? 'O' : 'X');
    setCurrentPlayer(symbol);
    setGameActive(true);
    setShowSymbolSelection(false);
  };

  const makeMove = (row: number, col: number) => {
    if (!gameActive || currentPlayer !== userSymbol || board[row][col] !== '') return;
  
    // Deep copy the board
    const newBoard = board.map(row => [...row]);
  
    newBoard[row][col] = currentPlayer!; // Update the selected cell
  
    setBoard(newBoard);
  
    if (checkWinner(newBoard)) {
      setResult('You win! 🎉');
      setGameActive(false);
      return;
    } else if (newBoard.flat().every(cell => cell !== '')) {
      setResult("It's a draw! 🤝");
      setGameActive(false);
      return;
    }
  
    setCurrentPlayer(computerSymbol);
    setTimeout(() => computerMove(newBoard), 500);
  };
  

  const computerMove = (currentBoard: string[][]) => {
    if (!gameActive) return;
  
    let move = findWinningMove(currentBoard, computerSymbol!);
    if (!move) move = findWinningMove(currentBoard, userSymbol!);
    if (!move && currentBoard[1][1] === '') move = [1, 1];
  
    if (!move) {
      const corners = [[0, 0], [0, 2], [2, 0], [2, 2]].filter(([r, c]) => currentBoard[r][c] === '');
      if (corners.length > 0) move = corners[Math.floor(Math.random() * corners.length)];
    }
  
    if (!move) {
      const emptyCells: [number, number][] = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (currentBoard[i][j] === '') emptyCells.push([i, j]);
        }
      }
      if (emptyCells.length > 0) move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
  
    if (move) {
      const [row, col] = move;
  
      // Deep copy the board
      const newBoard = currentBoard.map(row => [...row]);
  
      newBoard[row][col] = computerSymbol!;
  
      setBoard(newBoard);
  
      if (checkWinner(newBoard)) {
        setResult('Computer wins! 🤖');
        setGameActive(false);
        return;
      } else if (newBoard.flat().every(cell => cell !== '')) {
        setResult("It's a draw! 🤝");
        setGameActive(false);
        return;
      }
    }
  
    setCurrentPlayer(userSymbol);
  };
  

  const findWinningMove = (currentBoard: string[][], player: string) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (currentBoard[i][j] === '') {
          const tempBoard = currentBoard.map((r, k) =>
            k === i ? r.map((c, l) => (l === j ? player : c)) : r
          );
          if (checkWinner(tempBoard)) {
            return [i, j];
          }
        }
      }
    }
    return null;
  };

  const checkWinner = (currentBoard: string[][]) => {
    for (let i = 0; i < 3; i++) {
      if (
        currentBoard[i][0] &&
        currentBoard[i][0] === currentBoard[i][1] &&
        currentBoard[i][0] === currentBoard[i][2]
      )
        return true;
      if (
        currentBoard[0][i] &&
        currentBoard[0][i] === currentBoard[1][i] &&
        currentBoard[0][i] === currentBoard[2][i]
      )
        return true;
    }
    if (
      currentBoard[0][0] &&
      currentBoard[0][0] === currentBoard[1][1] &&
      currentBoard[0][0] === currentBoard[2][2]
    )
      return true;
    if (
      currentBoard[0][2] &&
      currentBoard[0][2] === currentBoard[1][1] &&
      currentBoard[0][2] === currentBoard[2][0]
    )
      return true;
    return false;
  };

  const restartGame = () => {
    setBoard([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]);
    setGameActive(true);
    setCurrentPlayer(userSymbol);
    setResult('');
  };

  const resetGame = () => {
    setBoard([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]);
    setGameActive(false);
    setCurrentPlayer(null);
    setUserSymbol(null);
    setComputerSymbol(null);
    setResult('');
    setShowSymbolSelection(true);
  };

  return (
    <div className="game-page">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-purple-600/5"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="game-content">
        {/* Header */}
        <div className="header">
          <Link to="/games" className="back-button">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Games</span>
          </Link>
          
          <motion.h1 
            className="game-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Tic Tac Toe
          </motion.h1>
          
          <div className="w-24"></div> {/* Empty div for flex balance */}
        </div>

        <motion.div 
          className="game-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {showSymbolSelection && (
            <motion.div 
              className="symbol-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="choose-title">Choose Your Symbol</h2>
              <div className="symbol-buttons">
                <motion.button 
                  className="symbol-btn x-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => startGame('X')}
                >
                  <X className="symbol-icon" />
                </motion.button>
                <motion.button 
                  className="symbol-btn o-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => startGame('O')}
                >
                  <Circle className="symbol-icon" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {gameActive && (
            <div className="game-wrapper">
              <div className="status-bar">
                {currentPlayer === userSymbol ? (
                  <motion.div 
                    className="turn-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key="your-turn"
                  >
                    Your turn ({userSymbol})
                  </motion.div>
                ) : (
                  <motion.div 
                    className="turn-indicator computer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key="computer-turn"
                  >
                    Computer's turn ({computerSymbol})
                  </motion.div>
                )}
              </div>

              <div className="game-board">
                {board.map((row, rowIndex) => (
                  <div className="board-row" key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <motion.div
                        key={`${rowIndex}-${colIndex}`}
                        className={`cell ${cell ? cell.toLowerCase() : ''} ${
                          board[rowIndex][colIndex] === '' && currentPlayer === userSymbol && gameActive
                            ? 'cell-active'
                            : ''
                        }`}
                        onClick={() => makeMove(rowIndex, colIndex)}
                        whileHover={
                          board[rowIndex][colIndex] === '' && currentPlayer === userSymbol && gameActive
                            ? { scale: 1.05 }
                            : {}
                        }
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * (rowIndex * 3 + colIndex) }}
                      >
                        {cell === 'X' && <X className="symbol-in-cell" />}
                        {cell === 'O' && <Circle className="symbol-in-cell" />}
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!gameActive && !showSymbolSelection && (
            <motion.div 
              className="result-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="result">{result}</div>
            </motion.div>
          )}

          {!showSymbolSelection && (
            <div className="button-container">
              {!gameActive && (
                <motion.button 
                  className="action-btn restart-btn"
                  onClick={restartGame}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RotateCcw className="btn-icon" />
                  Play Again
                </motion.button>
              )}
              
              <motion.button 
                className="action-btn reset-btn"
                onClick={resetGame}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Choose New Symbol
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TicTacToe;