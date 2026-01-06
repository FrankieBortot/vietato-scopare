import vietatoScopare from './assets/vietato-scopare-wip.svg'
import './App.css'

function App() {

  return (
    <>
     <img src={vietatoScopare} className="logo vietatoScopare" alt="Vietato Scopare logo" />
     <h1>Something's coming for real</h1>
     <iframe
        className='video'
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
