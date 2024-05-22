import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../index.css';
import PlaceBox from '../components/PlaceBox';
import DayPlace from '../components/DayPlace';
import axios, { AxiosError } from 'axios';
import Place from '../../types/Place';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import { MapProvider } from '../context/MapContext';
import Map from '../components/Map';

const MakePlan = () => {
  const location = useLocation();
  const tripInfo = { ...location.state };
  tripInfo.startDate = new Date(tripInfo.startDate);
  tripInfo.endDate = new Date(tripInfo.endDate);
  const tripdataRef = useRef(tripInfo);
  const navigate = useNavigate();
  const [tripDays, setTripDays] = useState<number>(0);
  const [keyword, setKeyword] = useState('');
  const [lastIdx, setLastIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [res, setRes] = useState<Place[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<Place[][]>([[], [], []]);
  const { accessToken, refreshAccessToken } = useAuth();
  const placeLoadMoreRef = useRef<HTMLDivElement>(null);
  const placeObserver = useRef<IntersectionObserver>();
  const curr = 'makeplan';
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('q') || '';
  const city = queryParams.get('city') || '';
  const isLoading = useRef<boolean>(false);

  const fetchPlaceDataOnScroll = async () => {
    if (!isLoading.current) {
      isLoading.current = true;
      try {
        const placeResponse = await axios.get(
          `/tour/locations?city=${city}&keyword=${searchTerm}&lastIdx=${lastIdx}`,
        );

        setRes((prevData) => [...prevData, ...placeResponse.data]);
        setLastIdx((prevLastIdx) => prevLastIdx + placeResponse.data.length);
      } catch (error) {
        console.error('Failed to fetch place search results:', error);
      } finally {
        isLoading.current = false;
      }
    }
  };

  const getData = async () => {
    console.log(tripdataRef.current.city);
    console.log(keyword);
    try {
      const response = await axios.get(
        `tour/locations?city=${tripdataRef.current.city}&keyword=${keyword}&lastIdx=${lastIdx}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      setRes((prevData) => [...prevData, ...response.data]);
      setLastIdx((prevLastIdx) => prevLastIdx + response.data.length);
    } catch (error) {
      console.error('Failed to fetch place search results:', error);
    }
  };

  const addSelectedPlace = (selectedPlace: Place, dayIndex: number) => {
    setSelectedPlaces((prevSelectedPlaces) => {
      const newSelectedPlaces = [...prevSelectedPlaces];
      const modifiedPlace = { ...selectedPlace, placeId: null };
      newSelectedPlaces[dayIndex - 1].push(modifiedPlace);
      return newSelectedPlaces;
    });
  };

  const removePlace = (dayIndex: number, placeIndex: number) => {
    setSelectedPlaces((prevSelectedPlaces) => {
      const newSelectedPlaces = [...prevSelectedPlaces];
      newSelectedPlaces[dayIndex - 1].splice(placeIndex, 1);
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

  const handleTabClick = (index: number) => {
    console.log(index);
    setActiveTab(index); // 클릭한 탭의 인덱스를 상태로 설정
  };

  const naviBack = () => {
    navigate('/');
  };

  const notifySuccess = () =>
    toast.success('장소가 성공적으로 추가되었습니다!', {
      position: 'top-center',
    });

  const addPlace = async () => {
    try {
      const postData = selectedPlaces.flatMap((innerArray, index) => {
        const startDate = new Date(tripdataRef.current.startDate);
        console.log("start", startDate.getDate());
        const currentDate = new Date(startDate);
        console.log("index", index);
        if (tripInfo.check === 0)
          currentDate.setDate(startDate.getDate() + index + 1); // 시작 날짜에 인덱스를 더한 값
        else
        currentDate.setDate(startDate.getDate() + index); // 시작 날짜에 인덱스를 더한 값

        console.log("curr", currentDate);

        return innerArray.map((place, innerIndex) => {
          if ('placeId' in place) {
            return {
              placeId: place.placeId != null ? place.placeId : null,
              locationId: place.locationId,
              date: currentDate.toISOString().slice(0, 10),
              time: '00:00',
            };
          } else {
            return {
              placeId: null,
              locationId: place.locationId,
              date: currentDate.toISOString().slice(0, 10),
              time: '00:00',
            };
          }
        }).filter(placeData => placeData !== null);
      });

      console.log("selectedPlaces", selectedPlaces);
      console.log("postdata", postData);

        await axios

          .post('/schedule/place/' + tripdataRef.current.scheduleId, postData, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((response) => {
            console.log(response);
            notifySuccess();
            setTimeout(() => {
              navigate('/');
            }, 3000);
          });
    } catch (error) {
      if (
        (error as AxiosError).response &&
        (error as AxiosError).response?.status === 401
      ) {
        try {
          await refreshAccessToken();
        } catch (refreshError) {
          console.error('Failed to refresh access token:', refreshError);
        }
      } else {
        console.error('Failed to add place:', error);
      }
    }
  };

  const checkPlaces = async () => {
    try {
      await axios
        .get('/schedule/places/' + tripInfo.scheduleId, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setSelectedPlaces(response.data);
        });
    } catch (error) {
      if (
        (error as AxiosError).response &&
        (error as AxiosError).response?.status === 401
      ) {
        try {
          await refreshAccessToken();
        } catch (refreshError) {
          console.error('Failed to refresh access token:', refreshError);
        }
      } else {
        console.error('Failed to add place:', error);
      }
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      if (tripdataRef.current.startDate && tripdataRef.current.endDate) {
        const differenceInTime =
          tripdataRef.current.endDate.getTime() -
          tripdataRef.current.startDate.getTime();
        const differenceInDays = Math.floor(
          differenceInTime / (1000 * 3600 * 24)
        );
        const tripDays = differenceInDays + 1;
        setTripDays(tripDays);

        await checkPlaces();

      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedPlaces.length === 0) {
      const newTripPlaces = Array.from(
        { length: tripDays },
        () => [] as Place[],
      );
      setSelectedPlaces(newTripPlaces);
    }
  }, [selectedPlaces]);

  useEffect(() => {
    const placeOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    };

    const placeCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (searchTerm) {
            fetchPlaceDataOnScroll();
          } else {
            getData();
          }
        }
      });
    };

    placeObserver.current = new IntersectionObserver(
      placeCallback,
      placeOptions,
    );

    if (placeLoadMoreRef.current) {
      placeObserver.current.observe(placeLoadMoreRef.current);
    }

    return () => {
      if (placeObserver.current) {
        placeObserver.current.disconnect();
      }
    };
  }, [placeLoadMoreRef, location.search, lastIdx]);

  useEffect(() => {
    setLastIdx(0);
    setRes([]);
  }, [location.search]);

  const activePlaces = selectedPlaces[activeTab - 1] || [];
  const initialCenter =
    activePlaces.length > 0
      ? { latitude: activePlaces[activePlaces.length - 1].latitude, longitude: activePlaces[activePlaces.length - 1].longitude }
      : { latitude: 37.2795, longitude: 127.0438 };
  const initialMarkers = activePlaces.map((place) => ({
    placeId: place.locationId,
    latitude: place.latitude,
    longitude: place.longitude,
  }));

  return (
    console.log('startDate: ', tripInfo.startDate),
    console.log('endDate: ', tripInfo.endDate),
    console.log('Schedule ID:', tripInfo.scheduleId),
    <div className="w-full h-[90%] flex">
      <ToastContainer />
      <div className="w-1/2 h-full flex">
        <div className="w-1/2 h-full flex flex-col">
          <div className="flex w-full h-[10%]">
            <i
              className="backArrow ml-2 cursor-pointer w-[10%]"
              onClick={naviBack}
            ></i>
            <div className="flex items-center w-[90%]">
              <div className="font-['BMJUA'] text-3xl text-black ml-2 flex items-center">
                {tripInfo.city}
              </div>
            </div>
          </div>
          <div className="h-[10%]">
            <SearchBar curr={curr} />
          </div>
          <div className="flex justify-center h-[80%] overscroll-y-auto">
            <div className="w-11/12 grid grid-cols-2 justify-items-center items-center gap-3 mt-4 overflow-y-auto">
              {res.map((place: Place, index: number) => (
                <PlaceBox
                  key={index}
                  place={place}
                  addSelectedPlace={() => addSelectedPlace(place, activeTab)}
                />
              ))}
              <div ref={placeLoadMoreRef}></div>
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
                  className={`content ${activeTab === tabIndex + 1 ? 'active' : ''
                    }`}
                >
                  <div className="contentBox">
                    {selectedPlaces[activeTab - 1] && (
                      console.log("selectedPlaces", selectedPlaces),
                      <div className="w-full h-full flex flex-col items-center pt-3">
                        {selectedPlaces[activeTab - 1].map(
                          (selectedPlace, index) => (
                            <DayPlace
                              key={index}
                              index={index}
                              selectedPlace={selectedPlace}
                              removePlace={() => removePlace(activeTab, index)}
                            />
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="h-[100px] w-full flex justify-center items-center">
              <button
                className="h-1/2 bg-black text-white px-10 rounded-md text-xl font-['BMJUA']"
                onClick={addPlace}
              >
                추가
              </button>
            </div>
          </div>
        </div>
      </div>
      <MapProvider key={JSON.stringify(initialMarkers)} initialCenter={initialCenter} initialMarkers={initialMarkers}>
        <Map />
      </MapProvider>
    </div>

  );
};

export default MakePlan;
