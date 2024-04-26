import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchResults from '../components/SearchResults';
import axios from 'axios';
import { MapProvider } from '../context/MapContext';
import SearchBar from '../components/SearchBar';
import Map from '../components/Map';

interface PlaceData {
  locationId: number;
  name: string;
  address: string;
  imageUrl: string;
}

interface PlanData {
  scheduleId: string;
  name: string;
  startDate: string;
  endDate: string;
  userName: string;
  imageUrl: string;
}

const SearchPlace: React.FC = () => {
  const [activeTab, setActiveTab] = useState('장소 보기');
  const [placeSearchResults, setPlaceSearchResults] = useState<PlaceData[]>([]);
  const [planSearchResults, setPlanSearchResults] = useState<PlanData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      const queryParams = new URLSearchParams(location.search);
      const searchTerm = queryParams.get('q');
      if (searchTerm) {
        setSearchTerm(searchTerm);

        try {
          // 장소 데이터 가져오기
          const placeResponse = await axios.get(
            `/tour/locations?city=${searchTerm}`,
          );
          setPlaceSearchResults(placeResponse.data);

          // 일정 데이터 가져오기
          const planResponse = await axios.get(
            `/tour/schedules?city=${searchTerm}`,
          );
          setPlanSearchResults(planResponse.data);
        } catch (error) {
          console.error('Failed to fetch search results:', error);
        }
      } else {
        setPlaceSearchResults([]);
        setPlanSearchResults([]);
        setSearchTerm('');
      }
    };

    fetchData();
  }, [location.search]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full h-[864px] flex">
      <div className="w-1/2 h-full">
        <div className="w-full flex justify-center mt-10">
          <div className="w-11/12">
            <SearchBar />
          </div>
        </div>
        <div className="flex max-w-2xl mx-auto pt-4">
          <div
            className={`mx-auto justify-center py-2 text-center w-1/2 border-main-red-color font-BMJUA text-2xl cursor-pointer ${
              activeTab === '장소 보기'
                ? 'border-x-2 border-t-2 rounded-t-lg text-main-red-color'
                : 'border-b-2'
            }`}
            onClick={() => handleTabClick('장소 보기')}
          >
            장소 보기
          </div>
          <div
            className={`mx-auto justify-center py-2 text-center w-1/2 border-main-red-color font-BMJUA text-2xl cursor-pointer ${
              activeTab === '일정 보기'
                ? 'border-x-2 border-t-2 rounded-t-lg text-main-red-color'
                : 'border-b-2'
            }`}
            onClick={() => handleTabClick('일정 보기')}
          >
            일정 보기
          </div>
        </div>
        <div className="flex max-w-4xl justify-end mt-2">
          <Link
            to="/addplaceform"
            className="text-ms text-main-green-color font-Nanum Gothic underline underline-offset-4"
          >
            장소 직접 추가하기
          </Link>
        </div>
        <div className="tab-content">
          <div className={activeTab === '장소 보기' ? 'active' : ''}>
            <SearchResults
              data={placeSearchResults}
              searchTerm={searchTerm}
              tab={activeTab}
            />
          </div>
          <div className={activeTab === '일정 보기' ? 'active' : ''}>
            <SearchResults
              data={planSearchResults}
              searchTerm={searchTerm}
              tab={activeTab}
            />
          </div>
        </div>
      </div>
      <MapProvider initialCenter={{ latitude: 37.2795, longitude: 127.0438 }}>
        <Map />
      </MapProvider>
    </div>
  );
};

export default SearchPlace;
