import 'bootstrap/dist/css/bootstrap.css';
import React from 'react'

const App = ({ Component, pageProps }) => {
  return (
    <div className="container">
      <Component {...pageProps}/>
    </div>
  )
}

export default App;