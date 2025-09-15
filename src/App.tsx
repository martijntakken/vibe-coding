import { useState } from 'react'
import vortexLogo from '/vortex-logo.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <img src={vortexLogo} className="logo vortex" alt="Wortell Enterprise Security logo" />
      </div>
      <pre className="ascii-art">
{`
██╗    ██╗ ██████╗ ██████╗ ████████╗███████╗██╗     ██╗     
██║    ██║██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██║     ██║     
██║ █╗ ██║██║   ██║██████╔╝   ██║   █████╗  ██║     ██║     
██║███╗██║██║   ██║██╔══██╗   ██║   ██╔══╝  ██║     ██║     
╚███╔███╔╝╚██████╔╝██║  ██║   ██║   ███████╗███████╗███████╗
 ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚══════╝╚══════╝
            ENTERPRISE SECURITY
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
        Wortell Enterprise Security
      </p>
    </>
  )
}

export default App
