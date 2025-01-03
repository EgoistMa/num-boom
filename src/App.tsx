import { useState } from 'react'
import './App.css'

function App() {
  const bombs = Array.from({ length: 100 }, (_, i) => i + 1)
  const [targetBomb, setTargetBomb] = useState<number | null>(null)
  const [disabledNumbers, setDisabledNumbers] = useState<number[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [customNumber, setCustomNumber] = useState<string>('')

  const startGame = () => {
    // 如果游戏正在进行，点击按钮相当于触发炸弹
    if (targetBomb && !gameOver) {
      setGameOver(true)
      setDisabledNumbers(bombs)
      return
    }

    const number = customNumber ? parseInt(customNumber) : Math.floor(Math.random() * 100) + 1
    // 确保数字在1-100范围内
    if (number < 1 || number > 100 || isNaN(number)) {
      alert('请输入1-100之间的数字！')
      return
    }
    setTargetBomb(number)
    setGameOver(false)
    setDisabledNumbers([])
    setCustomNumber('')
  }

  const handleClick = (number: number) => {
    if (targetBomb === null || disabledNumbers.includes(number)) return

    if (number === targetBomb) {
      setGameOver(true)
      setDisabledNumbers(bombs)
    } else {
      let newDisabled: number[];
      if (number > targetBomb) {
        newDisabled = bombs.filter(n => n >= number)
      } else {
        newDisabled = bombs.filter(n => n <= number)
      }
      setDisabledNumbers([...new Set([...disabledNumbers, ...newDisabled])])
    }
  }

  const handleRightClick = (e: React.MouseEvent, number: number) => {
    e.preventDefault() // 阻止默认的右键菜单
    if (!targetBomb || gameOver) { // 只在游戏未开始或结束后生效
      setTargetBomb(number)
      setGameOver(false)
      setDisabledNumbers([])
      setCustomNumber('')
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div className="game-controls">
          <input 
            type="number" 
            value={customNumber}
            onChange={(e) => setCustomNumber(e.target.value)}
            placeholder="留空随机选择数字"
            min="1"
            max="100"
            disabled={targetBomb !== null && !gameOver}
          />
          <button onClick={startGame}>
            {targetBomb ? (gameOver ? '重新开始' : '结束此轮') : '开始游戏'}
          </button>
        </div>
        <div className="game-hint">
          {!targetBomb && <small>提示：输入1-100的数字，或留空随机生成。右键点击数字可直接开始游戏。</small>}
        </div>
        {targetBomb && <h2>目标数字: {gameOver ? targetBomb : '???'}</h2>}
        {gameOver && <h3>游戏结束！你点到炸弹了！</h3>}
      </div>
      
      <div className="bomb-grid">
        {bombs.map((number) => (
          <button
            key={number}
            className={`bomb-button 
                      ${disabledNumbers.includes(number) ? 'disabled' : ''} 
                      ${(gameOver && number === targetBomb) ? 'target' : ''}`}
            onClick={() => handleClick(number)}
            onContextMenu={(e) => handleRightClick(e, number)}
            disabled={disabledNumbers.includes(number) || gameOver || !targetBomb}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  )
}

export default App
