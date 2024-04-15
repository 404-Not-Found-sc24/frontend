import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import NavBar from './components/navbar';
import { BrowserRouter } from 'react-router-dom';
import Travledes from './pages/TravelDes';
import MakeTrip from './pages/MakeTrip';
import SignUp from './pages/SignUp';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/maketrip" element={<MakeTrip />} />
        <Route path="/traveldes" element={<Travledes />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
