import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import './Tetris.css'

type Position = { x: number; y: number }
type TetrominoKey = keyof typeof TETROMINOS

type ActivePiece = {
  type: TetrominoKey
  rotation: number
  position: Position
}

type BoardCell = TetrominoKey | null

type Board = BoardCell[][]

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20

const TETROMINOS = {
  I: {
    color: '#7de0ff',
    rotations: [
      [
        [0, 1],
        [1, 1],
        [2, 1],
        [3, 1],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
        [2, 3],
      ],
    ],
  },
  J: {
    color: '#5873ff',
    rotations: [
      [
        [0, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [1, 0],
        [2, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
        [2, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [0, 2],
        [1, 2],
      ],
    ],
  },
  L: {
    color: '#ffa53b',
    rotations: [
      [
        [2, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
        [2, 2],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
        [0, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [1, 2],
      ],
    ],
  },
  O: {
    color: '#ffd400',
    rotations: [
      [
        [1, 0],
        [2, 0],
        [1, 1],
        [2, 1],
      ],
    ],
  },
  S: {
    color: '#52df7b',
    rotations: [
      [
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 1],
      ],
      [
        [1, 0],
        [1, 1],
        [2, 1],
        [2, 2],
      ],
    ],
  },
  T: {
    color: '#b86bff',
    rotations: [
      [
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [1, 0],
        [1, 1],
        [2, 1],
        [1, 2],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
        [1, 2],
      ],
      [
        [1, 0],
        [0, 1],
        [1, 1],
        [1, 2],
      ],
    ],
  },
  Z: {
    color: '#ff4f64',
    rotations: [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 1],
      ],
      [
        [2, 0],
        [1, 1],
        [2, 1],
        [1, 2],
      ],
    ],
  },
} as const

const createBoard = (): Board =>
  Array.from({ length: BOARD_HEIGHT }, () => Array.from({ length: BOARD_WIDTH }, () => null))

const randomTetromino = (): TetrominoKey => {
  const keys = Object.keys(TETROMINOS) as TetrominoKey[]
  return keys[Math.floor(Math.random() * keys.length)]
}

const getCells = (type: TetrominoKey, rotation: number, position: Position) => {
  const pattern = TETROMINOS[type]
  const shape = pattern.rotations[rotation % pattern.rotations.length]

  return shape.map(([x, y]) => ({
    x: x + position.x,
    y: y + position.y,
  }))
}

const collides = (board: Board, type: TetrominoKey, rotation: number, position: Position) => {
  return getCells(type, rotation, position).some(({ x, y }) => {
    if (x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT) {
      return true
    }
    if (y >= 0 && board[y][x]) {
      return true
    }
    return false
  })
}

const mergePiece = (board: Board, piece: ActivePiece) => {
  const next = board.map((row) => [...row])
  getCells(piece.type, piece.rotation, piece.position).forEach(({ x, y }) => {
    if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
      next[y][x] = piece.type
    }
  })
  return next
}

const clearLines = (board: Board) => {
  const remaining = board.filter((row) => row.some((cell) => cell === null))
  const cleared = BOARD_HEIGHT - remaining.length

  while (remaining.length < BOARD_HEIGHT) {
    remaining.unshift(Array.from({ length: BOARD_WIDTH }, () => null))
  }

  return { cleared, board: remaining }
}

const createPiece = (type: TetrominoKey): ActivePiece => ({
  type,
  rotation: 0,
  position: { x: 3, y: -1 },
})

const LINE_SCORES = [0, 100, 300, 500, 800]

const getScoreForClears = (cleared: number, level: number) => (LINE_SCORES[cleared] ?? 0) * level

export default function Tetris() {
  const [board, setBoard] = useState<Board>(() => createBoard())
  const [activePiece, setActivePiece] = useState<ActivePiece | null>(null)
  const [nextPiece, setNextPiece] = useState<TetrominoKey>(() => randomTetromino())
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const [level, setLevel] = useState(1)
  const [isRunning, setIsRunning] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)

  const startGame = useCallback(() => {
    const first = randomTetromino()
    const upcoming = randomTetromino()

    setBoard(createBoard())
    setActivePiece(createPiece(first))
    setNextPiece(upcoming)
    setScore(0)
    setLines(0)
    setLevel(1)
    setIsRunning(true)
    setIsGameOver(false)
  }, [])

  const lockPiece = useCallback(
    (piece: ActivePiece) => {
      setBoard((current) => {
        const merged = mergePiece(current, piece)
        const { board: clearedBoard, cleared } = clearLines(merged)

        if (cleared > 0) {
          setLines((prev) => {
            const total = prev + cleared
            const newLevel = Math.floor(total / 10) + 1
            setLevel(newLevel)
            setScore((prevScore) => prevScore + getScoreForClears(cleared, newLevel))
            return total
          })
        }

        const candidate = createPiece(nextPiece)
        if (collides(clearedBoard, candidate.type, candidate.rotation, candidate.position)) {
          setActivePiece(null)
          setIsRunning(false)
          setIsGameOver(true)
        } else {
          setActivePiece(candidate)
        }

        setNextPiece(randomTetromino())
        return clearedBoard
      })
    },
    [nextPiece]
  )

  const movePiece = useCallback(
    (offset: Position) => {
      if (!activePiece || !isRunning || isGameOver) {
        return
      }

      const nextPosition = {
        x: activePiece.position.x + offset.x,
        y: activePiece.position.y + offset.y,
      }

      if (collides(board, activePiece.type, activePiece.rotation, nextPosition)) {
        if (offset.y === 1) {
          lockPiece(activePiece)
        }
        return
      }

      setActivePiece({ ...activePiece, position: nextPosition })
    },
    [activePiece, board, isGameOver, isRunning, lockPiece]
  )

  const rotatePiece = useCallback(
    (direction: number) => {
      if (!activePiece || !isRunning || isGameOver) {
        return
      }

      const pattern = TETROMINOS[activePiece.type]
      const rotations = pattern.rotations.length
      const nextRotation = (activePiece.rotation + direction + rotations) % rotations

      if (!collides(board, activePiece.type, nextRotation, activePiece.position)) {
        setActivePiece({ ...activePiece, rotation: nextRotation })
        return
      }

      const kicks = [-1, 1, -2, 2]
      for (const kick of kicks) {
        const kickedPosition = { x: activePiece.position.x + kick, y: activePiece.position.y }
        if (!collides(board, activePiece.type, nextRotation, kickedPosition)) {
          setActivePiece({ ...activePiece, rotation: nextRotation, position: kickedPosition })
          return
        }
      }
    },
    [activePiece, board, isGameOver, isRunning]
  )

  const hardDrop = useCallback(() => {
    if (!activePiece || !isRunning || isGameOver) {
      return
    }

    let drop = 0
    while (!collides(board, activePiece.type, activePiece.rotation, { x: activePiece.position.x, y: activePiece.position.y + drop + 1 })) {
      drop += 1
    }

    if (drop === 0) {
      return
    }

    const landed: ActivePiece = {
      ...activePiece,
      position: { x: activePiece.position.x, y: activePiece.position.y + drop },
    }

    lockPiece(landed)
  }, [activePiece, board, isGameOver, isRunning, lockPiece])

  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (!activePiece && !isGameOver && event.key === 'Enter') {
        startGame()
        return
      }

      if (!isRunning) {
        if (event.key === 'Enter') {
          startGame()
        }
        return
      }

      if (!activePiece || isGameOver) {
        return
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          movePiece({ x: -1, y: 0 })
          break
        case 'ArrowRight':
          event.preventDefault()
          movePiece({ x: 1, y: 0 })
          break
        case 'ArrowDown':
          event.preventDefault()
          movePiece({ x: 0, y: 1 })
          break
        case 'ArrowUp':
        case 'x':
        case 'X':
          event.preventDefault()
          rotatePiece(1)
          break
        case 'z':
        case 'Z':
          event.preventDefault()
          rotatePiece(-1)
          break
        case ' ': {
          event.preventDefault()
          hardDrop()
          break
        }
      }
    },
    [activePiece, hardDrop, isGameOver, isRunning, movePiece, rotatePiece, startGame]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  useEffect(() => {
    if (!isRunning || !activePiece || isGameOver) {
      return
    }

    const speed = Math.max(120, 800 - (level - 1) * 70)
    const timer = window.setInterval(() => {
      movePiece({ x: 0, y: 1 })
    }, speed)

    return () => window.clearInterval(timer)
  }, [activePiece, isGameOver, isRunning, level, movePiece])

  useEffect(() => {
    if (isRunning && !activePiece && !isGameOver) {
      const piece = createPiece(randomTetromino())
      if (collides(board, piece.type, piece.rotation, piece.position)) {
        setIsGameOver(true)
        setIsRunning(false)
        setActivePiece(null)
      } else {
        setActivePiece(piece)
      }
    }
  }, [activePiece, board, isGameOver, isRunning])

  const displayBoard = useMemo(() => {
    const withActive = board.map((row) => [...row])
    if (!activePiece) {
      return withActive
    }

    getCells(activePiece.type, activePiece.rotation, activePiece.position).forEach(({ x, y }) => {
      if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
        withActive[y][x] = activePiece.type
      }
    })

    return withActive
  }, [activePiece, board])

  const preview = useMemo(() => {
    const size = 4
    const grid: Board = Array.from({ length: size }, () => Array.from({ length: size }, () => null))
    const pattern = TETROMINOS[nextPiece]
    const shape = pattern.rotations[0]
    const minX = Math.min(...shape.map(([x]) => x))
    const minY = Math.min(...shape.map(([, y]) => y))

    shape.forEach(([x, y]) => {
      const px = x - minX
      const py = y - minY
      if (px >= 0 && px < size && py >= 0 && py < size) {
        grid[py][px] = nextPiece
      }
    })

    return grid
  }, [nextPiece])

  const statusMessage = useMemo(() => {
    if (isGameOver) {
      return 'Game over!'
    }
    if (!isRunning) {
      return 'Press start to play'
    }
    return 'Have fun!'
  }, [isGameOver, isRunning])

  return (
    <section className="tetris" aria-labelledby="tetris-heading">
      <div className="tetris__panel">
        <header className="tetris__header">
          <h2 id="tetris-heading">Tetris</h2>
          <p className="tetris__status">{statusMessage}</p>
        </header>
        <div className="tetris__layout">
          <div className="tetris__board">
            {displayBoard.map((row, rowIndex) => (
              <div className="tetris__row" key={rowIndex}>
                {row.map((cell, columnIndex) => {
                  const style = cell ? ({ '--cell-color': TETROMINOS[cell].color } as CSSProperties) : undefined
                  return (
                    <div
                      key={`${rowIndex}-${columnIndex}`}
                      className={`tetris__cell ${cell ? 'tetris__cell--filled' : ''}`}
                      style={style}
                    />
                  )
                })}
              </div>
            ))}
            {isGameOver && (
              <div className="tetris__overlay" role="alert">
                <p>Game over</p>
                <button type="button" onClick={startGame}>
                  Restart
                </button>
              </div>
            )}
          </div>
          <aside className="tetris__sidebar">
            <div className="tetris__stat">
              <span className="tetris__label">Score</span>
              <strong>{score}</strong>
            </div>
            <div className="tetris__stat">
              <span className="tetris__label">Lines</span>
              <strong>{lines}</strong>
            </div>
            <div className="tetris__stat">
              <span className="tetris__label">Level</span>
              <strong>{level}</strong>
            </div>
            <div className="tetris__next">
              <span className="tetris__label">Next</span>
              <div className="tetris__preview">
                {preview.map((row, rowIndex) => (
                  <div className="tetris__preview-row" key={rowIndex}>
                    {row.map((cell, columnIndex) => {
                      const style = cell ? ({ '--cell-color': TETROMINOS[cell].color } as CSSProperties) : undefined
                      return (
                        <div
                          key={`${rowIndex}-${columnIndex}`}
                          className={`tetris__preview-cell ${cell ? 'tetris__preview-cell--filled' : ''}`}
                          style={style}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="tetris__controls">
              <button type="button" onClick={startGame}>
                {isRunning ? 'Restart' : 'Start'}
              </button>
              <div className="tetris__hint">
                <p>Controls</p>
                <ul>
                  <li>← → move</li>
                  <li>↑ / X rotate</li>
                  <li>Z rotate CCW</li>
                  <li>↓ soft drop</li>
                  <li>Space hard drop</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
