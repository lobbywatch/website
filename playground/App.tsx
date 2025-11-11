import './App.css'
import { useState } from 'react'

const App = () => {
  const [counter, setCounter] = useState(0)
  return (
    <div className='content'>
      <a href='/test'>Test</a>
      <h1>Rsbuild with Reacttttt!</h1>
      <p>Start building amazing things with Rsbuild.</p>
      <button onClick={() => setCounter(counter + 1)}>Count: {counter}</button>
    </div>
  )
}

export default App
