import { useState } from 'react'
import './App.css'
import Typography from './design-components/typography-components/typography'
import Color from './design-components/color-components/color'

const App = () => {
  const [selectedFont, setSelectedFont] = useState('')

  return (
    // Main Container Start
    <div className="main" style={{"--current-font": selectedFont}}> 

      {/* Main title */}
      <div className="mainTitle">
        <h1>Design System{' '}
          <span className="subMainTitle">by Kiefer John Sanchez</span>
        </h1>
      </div>

      {/* Typography */}
      <Typography onFontChange={setSelectedFont}/>

      {/* Color */}
      <Color />
    </div> // Main Container End
  )
}


export default App
