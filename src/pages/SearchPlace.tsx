import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import { MapProvider } from '../context/MapContext';
import Map from '../components/Map';
import PlaceData from '../../types/PlaceData';

const SearchPlace: React.FC = () => {
  const [activeTab, setActiveTab] = useState('장소 보기');
  const [places, setPlaces] = useState<PlaceData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [initialCenter, setInitialCenter] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 37.2795,
    longitude: 127.0438,
  });
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const term = queryParams.get('q') || '';
    setSearchTerm(term);
  }, [location.search]);
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleResultsUpdate = (newPlaces: PlaceData[]) => {
    setPlaces(newPlaces);
    if (newPlaces.length > 0) {
      setInitialCenter({
        latitude: newPlaces[0].latitude,
        longitude: newPlaces[0].longitude,
      });
    }
  };

  const initialMarkers = places.map((place) => ({
    placeId: place.locationId,
    latitude: place.latitude,
    longitude: place.longitude,
  }));

  const naviBack = () => {
    window.history.back();
  };

  return (
    <div className="w-full h-[90%] flex">
      <div className="w-1/2 h-full">
        <div className="h-[10%] w-full">
          <i
            className="absolute backArrow cursor-pointer h-[10%] w-[5%]"
            onClick={naviBack}
          ></i>
          <div className="w-full flex justify-center h-[10%]">
            <div className="w-5/6">
              <SearchBar curr={'main'} />
            </div>
          </div>
        </div>
        <div className="h-[8%] w-full flex justify-center">
          <div className="flex max-w-2xl mx-5 pt-4 w-[80%]">
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
        </div>
        <div className="flex max-w-4xl justify-end h-[2%] w-full px-10">
          <Link
            to="/addplaceform"
            className="text-ms text-main-green-color font-Nanum Gothic underline underline-offset-4"
          >
            장소 직접 추가하기
          </Link>
        </div>
        <div className="tab-content h-[80%] overflow-y-scroll">
          <div className={activeTab === '장소 보기' ? 'active' : ''}>
            {activeTab === '장소 보기' && (
              <div className="h-[90%] bg-white p-10">
                <SearchResults
                  tab={activeTab}
                  onResultsUpdate={handleResultsUpdate}
                />
              </div>
            )}
          </div>
          <div className={activeTab === '일정 보기' ? 'active' : ''}>
            {activeTab === '일정 보기' && (
              <SearchResults
                tab={activeTab}
                onResultsUpdate={handleResultsUpdate}
              />
            )}
          </div>
        </div>
      </div>
      <MapProvider
        key={JSON.stringify(initialMarkers)}
        initialCenter={initialCenter}
        initialMarkers={initialMarkers}
      >
        <Map />
      </MapProvider>
    </div>
  );
};

export default SearchPlace;
