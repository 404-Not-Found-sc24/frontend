import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import NavBar from './components/navbar';
import { BrowserRouter } from 'react-router-dom';
import Travledes from './pages/TravelDes';
import SignUp from './pages/SignUp';
import MakePlan from './pages/MakePlan';
import SearchPlace from './pages/SearchPlace';
import PlaceInfo from './pages/PlaceInfo';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/searchplace" element={<SearchPlace />} />
        <Route path="/placeinfo" element={<PlaceInfo />} />
        <Route path="/traveldes" element={<Travledes />} />
        <Route path="/makeplan" element={<MakePlan />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
