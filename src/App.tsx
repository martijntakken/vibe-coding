import { useState } from 'react'
import wortellLogo from './assets/wortell-logo.svg'
import './App.css'
import Tetris from './Tetris'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://wortell.nl" target="_blank">
          <img src={wortellLogo} className="logo" alt="Wortell Enterprise Security logo" />
        </a>
      </div>
      <pre style={{ 
        fontFamily: 'monospace', 
        fontSize: '14px', 
        lineHeight: '1.2', 
        color: '#4CAF50',
        textShadow: '0 0 5px #4CAF50',
        background: '#0a0a0a',
        padding: '20px',
        borderRadius: '5px',
        margin: '20px 0',
        textAlign: 'center'
      }}>
{`
██╗    ██╗ ██████╗ ██████╗ ████████╗███████╗██╗     ██╗     
██║    ██║██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██║     ██║     
██║ █╗ ██║██║   ██║██████╔╝   ██║   █████╗  ██║     ██║     
██║███╗██║██║   ██║██╔══██╗   ██║   ██╔══╝  ██║     ██║     
╚███╔███╔╝╚██████╔╝██║  ██║   ██║   ███████╗███████╗███████╗
 ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚══════╝╚══════╝

████████████████████████████████████████████████████████████
                                                            
  ███████╗███╗   ██╗████████╗███████╗██████╗ ██████╗ ██████╗ 
  ██╔════╝████╗  ██║╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██╔══██╗
  █████╗  ██╔██╗ ██║   ██║   █████╗  ██████╔╝██████╔╝██████╔╝
  ██╔══╝  ██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗██╔═══╝ ██╔══██╗
  ███████╗██║ ╚████║   ██║   ███████╗██║  ██║██║     ██║  ██║
  ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝
                                                            
  ██████╗███████╗ ██████╗██╗   ██╗██████╗ ██╗████████╗██╗   ██╗
 ██╔════╝██╔════╝██╔════╝██║   ██║██╔══██╗██║╚══██╔══╝╚██╗ ██╔╝
 ██║     █████╗  ██║     ██║   ██║██████╔╝██║   ██║    ╚████╔╝ 
 ██║     ██╔══╝  ██║     ██║   ██║██╔══██╗██║   ██║     ╚██╔╝  
 ╚██████╗███████╗╚██████╗╚██████╔╝██║  ██║██║   ██║      ██║   
  ╚═════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝   ╚═╝      ╚═╝   
`}
      </pre>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Wortell Enterprise Security logo to learn more
      </p>
      <Tetris />
    </>
  )
}

export default App
