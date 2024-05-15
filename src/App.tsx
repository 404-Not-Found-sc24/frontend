import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import NavBar from './components/NavBar';
import { BrowserRouter } from 'react-router-dom';
import Travledes from './pages/TravelDes';
import SearchPlace from './pages/SearchPlace';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import { AuthProvider } from './context/AuthContext';
import PlaceInfo from './pages/PlaceInfo';
import MakePlan from './pages/MakePlan';
import MakeDiary from './pages/MakeDiary';
import DiaryDetail from './pages/DiaryDetail';
import PlanDetail from './pages/PlanDetail';
import AddPlaceForm from './pages/AddPlaceForm';
import { MapProvider } from './context/MapContext';
import SearchTravelDes from './pages/SearchTravelDes';
import EventPage from './pages/Event';
import MyPage from './pages/MyPage';
import MyPlan from './pages/MyPlan';
import ScheduleEx from './pages/ScheduleEx';
import MyPlanPage from './pages/MyPlanPage';
import MyDiaryDetail from './pages/MyDiaryDetail';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/makediary" element={<MakeDiary />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/makeplan"
            element={
              <MapProvider
                initialCenter={{ latitude: 37.2795, longitude: 127.0438 }}
              >
                <MakePlan />
              </MapProvider>
            }
          />
          <Route path="/placeinfo" element={<PlaceInfo />} />
          <Route path="/searchplace" element={<SearchPlace />} />
          <Route path="/searchtraveldes" element={<SearchTravelDes />} />
          <Route path="/traveldes" element={<Travledes />} />
          <Route path="/plandetail" element={<PlanDetail />} />
          <Route path="/diarydetail" element={<DiaryDetail />} />
          <Route path="/mydiarydetail" element={<MyDiaryDetail />} />
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
          <Route path="/event" element={<EventPage />} />
          <Route path="myplan" element={<MyPlan />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/myplanpage" element={<MyPlanPage />} />
          <Route path="/scheduleex" element={<ScheduleEx />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
