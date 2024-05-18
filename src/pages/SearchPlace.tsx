import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import { MapProvider } from '../context/MapContext';
import Map from '../components/Map';

const SearchPlace: React.FC = () => {
  const [activeTab, setActiveTab] = useState('장소 보기');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const term = queryParams.get('q') || '';
    setSearchTerm(term);
  }, [location.search]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full h-screen flex">
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
        <div className="flex max-w-4xl justify-end mt-2 mx-10">
          <Link
            to="/addplaceform"
            className="text-ms text-main-green-color font-Nanum Gothic underline underline-offset-4"
          >
            장소 직접 추가하기
          </Link>
        </div>
        <div className="tab-content">
          <div className={activeTab === '장소 보기' ? 'active' : ''}>
            {activeTab === '장소 보기' && <SearchResults tab={activeTab} />}
          </div>
          <div className={activeTab === '일정 보기' ? 'active' : ''}>
            {activeTab === '일정 보기' && <SearchResults tab={activeTab} />}
          </div>
        </div>
      </div>
      {/*<MapProvider initialCenter={{ latitude: 37.2795, longitude: 127.0438 }}>
        <Map />
      </MapProvider>*/}
    </div>
  );
};

export default SearchPlace;
