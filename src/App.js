import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Landing from './Components/Landing';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Meet from './Components/Meet';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing/>} />
          <Route path='/meet' element={<Meet />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
