import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../index.css';
import PlaceBox from '../components/PlaceBox';
import DayPlace from '../components/DayPlace';
import axios from 'axios';
import Place from '../../types/Place';
import SearchBar from '../components/SearchBar';
import Map from '../components/Map';
import { MapProvider } from '../context/MapContext';

const MakePlan = () => {
  const location = useLocation();
  const tripInfo = { ...location.state };
  const navigate = useNavigate();
  const [tripDays, setTripDays] = useState<number>(0);
  const [keyword, setKeyword] = useState('');
  const [activeTab, setActiveTab] = useState<number>(1);
  const [res, setRes] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState<Array<Array<Place>>>([]);

  useEffect(() => {
    getData();
    if (tripInfo.startDate && tripInfo.endDate) {
      const differenceInTime =
        tripInfo.endDate.getTime() - tripInfo.startDate.getTime();
      const differenceInDays = Math.floor(
        differenceInTime / (1000 * 3600 * 24),
      );
      const tripDays = differenceInDays + 1;
      setTripDays(tripDays);

      const newTripPlaces = Array.from(
        { length: tripDays },
        () => [] as Place[],
      );
      setSelectedPlaces(newTripPlaces);
    }
  }, []);

  const addSelectedPlace = (selectedPlace: Place, dayIndex: number) => {
    setSelectedPlaces((prevSelectedPlaces) => {
      const newSelectedPlaces = [...prevSelectedPlaces];
      newSelectedPlaces[dayIndex - 1].push(selectedPlace);
      return newSelectedPlaces;
    });
    console.log(selectedPlaces);
  };

  const removePlace = (dayIndex: number, placeIndex: number) => {
    setSelectedPlaces((prevSelectedPlaces) => {
      const newSelectedPlaces = [...prevSelectedPlaces];
      newSelectedPlaces[dayIndex].splice(placeIndex, 1);
      return newSelectedPlaces;
    });
  };

  const generateTabs = (days: number) => {
    const tabs = [];
    for (let i = 1; i <= days; i++) {
      tabs.push(
        <div
          key={i}
          className={`tab ${activeTab === i ? 'active' : ''}`}
          onClick={() => handleTabClick(i)}
        >
          <div className="tabContent">{`${i}일차`}</div>
        </div>,
      );
    }
    return tabs;
  };

  const getData = async () => {
    console.log(tripInfo.city);
    console.log(keyword);
    try {
      await axios
        .get('tour/locations?city=' + tripInfo.city + '&keyword=' + keyword, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log(response.data);
          setRes(response.data);
        });
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleTabClick = (index: number) => {
    console.log(index);
    setActiveTab(index); // 클릭한 탭의 인덱스를 상태로 설정
  };

  const naviBack = () => {
    navigate('/');
  };

  return (
    <div className="w-full h-[864px] flex">
      <div className="w-1/2 h-full flex">
        <div className="w-1/2 h-full flex flex-col">
          <div className="flex">
            <i className="backArrow ml-2 cursor-pointer" onClick={naviBack}></i>
            <div className="font-['Nanum Gothic'] text-3xl font-semibold text-black ml-2 w-72 flex items-center">
              {tripInfo.city}
            </div>
          </div>
          <SearchBar />
          <div className="flex justify-center">
            <div className="w-11/12 grid grid-cols-2 justify-items-center items-center gap-3 mt-4">
              {res.map((place: Place, index: number) => (
                <PlaceBox
                  key={index}
                  place={place}
                  addSelectedPlace={() => addSelectedPlace(place, activeTab)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="w-1/2 h-full flex">
          <div className="tabs w-[40px]">{generateTabs(tripDays)}</div>
          <div className="flex flex-col w-full h-full border-4 border-[#FF9A9A] justify-between">
            <div className="tab-content">
              {Array.from({ length: tripDays }, (_, tabIndex) => (
                <div
                  key={tabIndex + 1}
                  id={`content${tabIndex + 1}`}
                  className={`content ${
                    activeTab === tabIndex + 1 ? 'active' : ''
                  }`}
                >
                  <div className="contentBox">
                    <div className="w-full h-full flex flex-col items-center pt-3">
                      {/*{selectedPlaces.map((selectedPlace, index) => (
                                                <DayPlace
                                                    key={index}
                                                    index={index}
                                                    selectedPlaces={selectedPlace}
                                                    removePlace={removePlace}
                                                />
                                            ))}*/}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-[100px] w-full flex justify-center items-center">
              <button className="h-1/2 bg-black text-white px-10 rounded-md text-xl font-['BMJUA']">
                생성
              </button>
            </div>
          </div>
        </div>
      </div>
      <MapProvider initialCenter={{ latitude: 37.2795, longitude: 127.0438 }}>
        <Map />
      </MapProvider>
    </div>
  );
};

export default MakePlan;
