import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchResults from '../components/SearchResults';
import plandata from '../plandata'; // 일정 데이터 파일
import SearchBar from '../components/SearchBar';
import Map from '../components/Map';
import axios from 'axios';

interface PlaceData {
  locationId: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
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

declare global {
  interface Window {
    kakao: any;
  }
}

const SearchPlace: React.FC = () => {
  const [activeTab, setActiveTab] = useState('장소 보기');
  const [placeSearchResults, setPlaceSearchResults] = useState<PlaceData[]>([]);
  const [planSearchResults, setPlanSearchResults] = useState<PlanData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const location = useLocation(); // 현재 URL 정보 가져오기

  useEffect(() => {
    const fetchData = async () => {
      const queryParams = new URLSearchParams(location.search);
      const searchTerm = queryParams.get('q');
      if (searchTerm) {
        setSearchTerm(searchTerm);

        // 장소 검색은 서버에서 처리
        try {
          const response = await axios.get(
            `/tour/locations?city=${searchTerm}`,
          );
          setPlaceSearchResults(response.data);
        } catch (error) {
          console.error('Failed to fetch place search results:', error);
        }
        // 일정 검색은 클라이언트에서 처리
        const filteredPlanData = plandata.filter((plan) =>
          plan.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        setPlanSearchResults(filteredPlanData);
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
        <div className="tab-content">
          <div className={activeTab === '장소 보기' ? 'active' : ''}>
            <SearchResults data={placeSearchResults} searchTerm={searchTerm} />
          </div>
          <div className={activeTab === '일정 보기' ? 'active' : ''}>
            <SearchResults data={planSearchResults} searchTerm={searchTerm} />
          </div>
        </div>
      </div>
      <Map />
    </div>
  );
};

export default SearchPlace;
