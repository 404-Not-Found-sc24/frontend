import * as React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Main from './pages/main';
import NavBar from './components/navbar';
import { BrowserRouter } from 'react-router-dom';
import Travledes from './pages/TravelDes';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/traveldes" element={<Travledes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
