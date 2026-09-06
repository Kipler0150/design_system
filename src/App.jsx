import './App.css'
import Typography from './design-components/typography-components/typography'

const App = () => {
  return (
    // Main Container Start
    <div className="main"> 

      {/* Main title */}
      <div className="mainTitle">
        <h1>Design System{' '}
          <span className="subMainTitle">by Kiefer John Sanchez</span>
        </h1>
      </div>

      {/* Main Items */}
      <Typography />

      <div className="mainItem colorDesign">
        <h2>COLOR</h2>
        <hr></hr>
      </div>
    </div> // Main Container End
  )
}


export default App
