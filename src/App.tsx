import * as React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Main from './pages/main';
import NavBar from './components/navbar';
import MakeTrip from "./pages/MakeTrip";
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Main />} />
          <Route path="/maketrip" element={<MakeTrip/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
