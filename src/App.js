import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import Main from './Main';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
          <Route path="/" exact component={Main} />
      </BrowserRouter>
    </div>
  );
}

export default App;
