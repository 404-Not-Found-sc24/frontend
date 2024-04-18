import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // useLocation을 이용하여 현재 URL 정보 가져오기
import SearchResults from '../components/searchresults';
import placedata from '../placedata'; // 추가된 장소 데이터 파일
import plandata from '../plandata'; // 일정 데이터 파일
import SearchBar from '../components/searchbar';

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
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get('q');
    if (searchTerm) {
      // 장소 데이터에서 검색
      const filteredPlaceData = placedata.filter(
        (place) =>
          (place.name &&
            place.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          place.address.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setPlaceSearchResults(filteredPlaceData);

      // 일정 데이터에서 검색
      const filteredPlanData = plandata.filter((plan) =>
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setPlanSearchResults(filteredPlanData);

      setSearchTerm(searchTerm);
    } else {
      // 검색어가 없다면 검색 결과 초기화
      setPlaceSearchResults([]);
      setPlanSearchResults([]);
      setSearchTerm('');
    }
  }, [location.search]);

  useEffect(() => {
    // window.kakao.maps가 정의된 이후에 맵을 초기화
    if (window.kakao && window.kakao.maps) {
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 지도 중심 좌표
        level: 3, // 지도의 레벨(확대, 축소 정도)
      };
      new window.kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴
    }
  }, []);
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex">
      <div className="w-1/2">
        <SearchBar />
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
          {activeTab === '장소 보기' && (
            <SearchResults data={placeSearchResults} searchTerm={searchTerm} />
          )}
          {activeTab === '일정 보기' && (
            <SearchResults data={planSearchResults} searchTerm={searchTerm} />
          )}
        </div>
      </div>
      <div id="map" style={{ width: '50vw', height: '100vh' }}></div>
    </div>
  );
};

export default SearchPlace;
