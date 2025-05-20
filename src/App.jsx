import vietatoScopare from './assets/vietato-scopare-wip.svg'
import './App.css'

function App() {

  return (
    <>
     <h1>Something's coming...</h1>
     <img src={vietatoScopare} className="logo vietatoScopare" alt="Vietato Scopare logo" />
     <iframe
        src='https://www.youtube.com/embed/kh29SYeammw'
        frameborder='0'
        allow='autoplay; encrypted-media'
        allowfullscreen
        title='video'
      />
    </>
  )
}

export default App
