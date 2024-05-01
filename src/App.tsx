import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import NavBar from './components/NavBar';
import { BrowserRouter } from 'react-router-dom';
import Travledes from './pages/TravelDes';
import SignUp from './pages/SignUp';
import MakePlan from './pages/MakePlan';
import SearchPlace from './pages/SearchPlace';
import PlaceInfo from './pages/PlaceInfo';
import PlanDetail from './pages/PlanDetail';
import DiaryDetail from './pages/DiaryDetail';
import MakeDiary from './pages/MakeDiary';
import SignIn from './pages/SignIn';
import { AuthProvider } from './context/AuthContext';
import { MapProvider } from './context/MapContext';
import AddPlaceForm from './pages/AddPlaceForm';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/searchplace" element={<SearchPlace />} />
          <Route path="/placeinfo" element={<PlaceInfo />} />
          <Route path="/traveldes" element={<Travledes />} />
          <Route path="/makeplan" element={<MakePlan />} />
          <Route
            path="/addplaceform"
            element={
              <MapProvider
                initialCenter={{ latitude: 37.2795, longitude: 127.0438 }}
              >
                <AddPlaceForm />
              </MapProvider>
            }
          />
          <Route path="/makediary" element={<MakeDiary />} />
          <Route path="/plandetail" element={<PlanDetail />} />
          <Route path="/diarydetail" element={<DiaryDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
