import React from 'react'
import ReactDOMServer from 'react-dom/server'

export function render() {
  return ReactDOMServer.renderToString(
    <React.StrictMode>
      <div className='content'>
        <a href='/'>Home</a>
        <h1>Tessssst</h1>
        <div id='bla'></div>
      </div>
    </React.StrictMode>,
  )
}
