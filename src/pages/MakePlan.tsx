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

interface State {
  center: {
    lat: number;
    lng: number;
  };
  errMsg: string | null;
  isLoading: boolean;
}

type DivisionsType = {
  전체: Place[];
  음식점: Place[];
  문화시설: Place[];
  '축제 공연 행사': Place[];
  관광지: Place[];
  레포츠: Place[];
  숙박: Place[];
  쇼핑: Place[];
};

const MakePlan = () => {
  const location = useLocation();
  const tripInfo = { ...location.state };
  console.log(tripInfo);
  if (Object.keys(tripInfo).length === 0) {
    throw new Error('Trip info is missing');
  }
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
  const [times, setTimes] = useState<string[][]>([[], [], []]);
  const [state, setState] = useState<State>({
    center: {
      lat: 37.2795,
      lng: 127.0438,
    },
    errMsg: null,
    isLoading: true,
  });
  const [lastPlaceIdx, setLastPlaceIdx] = useState<
    Record<keyof DivisionsType, number>
  >({
    전체: 0,
    음식점: 0,
    문화시설: 0,
    '축제 공연 행사': 0,
    관광지: 0,
    레포츠: 0,
    숙박: 0,
    쇼핑: 0,
  });

  const [initialCenter, setInitialCenter] = useState({
    latitude: state.center.lat,
    longitude: state.center.lng,
  });
  const [key, setKey] = useState(JSON.stringify(initialCenter));

  const [divisions, setDivisions] = useState<DivisionsType>({
    전체: [],
    음식점: [],
    문화시설: [],
    '축제 공연 행사': [],
    관광지: [],
    레포츠: [],
    숙박: [],
    쇼핑: [],
  });
  const [activeDivision, setActiveDivision] =
    useState<keyof DivisionsType>('전체');

  const handleDivisionClick = (division: keyof DivisionsType) => {
    setActiveDivision(division);
  };

  const activePlaces = selectedPlaces[activeTab - 1] || [];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            isLoading: false,
          }));
          setInitialCenter({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          setState((prev) => ({
            ...prev,
            errMsg: err.message,
            isLoading: false,
          }));
        },
      );
    } else {
      setState((prev) => ({
        ...prev,
        errMsg: 'geolocation을 사용할 수 없어요..',
        isLoading: false,
      }));
    }
  }, []);

  useEffect(() => {
    if (activePlaces.length > 0) {
      setInitialCenter({
        latitude: activePlaces[activePlaces.length - 1].latitude,
        longitude: activePlaces[activePlaces.length - 1].longitude,
      });
    }
  }, [selectedPlaces, activePlaces, res, state.center.lat, state.center.lng]);

  useEffect(() => {
    setKey(JSON.stringify(initialCenter));
  }, [initialCenter]);

  const handleTimeChange = (
    dayIndex: number,
    placeIndex: number,
    time: string,
  ) => {
    setSelectedPlaces((prevSelectedPlaces) => {
      const newSelectedPlaces = prevSelectedPlaces.map((day, idx) => {
        if (idx === dayIndex - 1) {
          return day
            .map((place, i) => {
              if (i === placeIndex) {
                return { ...place, time };
              }
              return place;
            })
            .sort((a, b) => {
              if (a.time && b.time) {
                return a.time.localeCompare(b.time);
              }
              return 0;
            });
        }
        return day;
      });

      return newSelectedPlaces;
    });
  };

  useEffect(() => {}, [times]);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const fetchPlaceDataOnScroll = async (division: keyof DivisionsType) => {
    console.log('hel');
    if (!isLoading.current) {
      isLoading.current = true;
      try {
        const currDivision = division === '전체' ? '' : division;
        const placeResponse = await axios.get(
          `/tour/locations?city=${city}&keyword=${searchTerm}&lastIdx=${lastPlaceIdx[division]}&division=${currDivision}`,
        );

        console.log('res', placeResponse.data);
        setRes([...divisions[division], ...placeResponse.data]);
        setLastIdx((prevLastIdx) => prevLastIdx + placeResponse.data.length);

        const newPlaceResults = [...divisions[division], ...placeResponse.data];
        const newLastPlaceIdx =
          placeResponse.data.length < 20
            ? -1
            : lastPlaceIdx[division] + placeResponse.data.length;

        setLastPlaceIdx((prevIdx) => ({
          ...prevIdx,
          [division]: newLastPlaceIdx,
        }));

        setDivisions((preDivisions: DivisionsType) => ({
          ...preDivisions,
          [division]: [...preDivisions[division], ...placeResponse.data],
        }));
      } catch (error) {
        console.error('Failed to fetch place search results:', error);
      } finally {
        isLoading.current = false;
      }
    }
  };

  const getData = async (division: keyof DivisionsType) => {
    console.log('get');
    try {
      const currDivision = division === '전체' ? '' : division;
      const response = await axios.get(
        `/tour/locations?city=${city}&keyword=${searchTerm}&lastIdx=${lastPlaceIdx[division]}&division=${currDivision}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('res', response.data);
      setRes([...divisions[division], ...response.data]);
      setLastIdx((prevLastIdx) => prevLastIdx + response.data.length);
      const newLastPlaceIdx =
        response.data.length < 20
          ? -1
          : lastPlaceIdx[division] + response.data.length;

      setLastPlaceIdx((prevIdx) => ({
        ...prevIdx,
        [division]: newLastPlaceIdx,
      }));

      setDivisions((preDivisions: DivisionsType) => ({
        ...preDivisions,
        [division]: [...preDivisions[division], ...response.data],
      }));
    } catch (error) {
      console.error('Failed to fetch place search results:', error);
    }
  };

  const addSelectedPlace = (selectedPlace: Place, dayIndex: number) => {
    setSelectedPlaces((prevSelectedPlaces) => {
      const newSelectedPlaces = [...prevSelectedPlaces];
      if (!newSelectedPlaces[dayIndex - 1]) {
        newSelectedPlaces[dayIndex - 1] = [];
      }
      const modifiedPlace = { ...selectedPlace, placeId: null, time: '00:00' };
      newSelectedPlaces[dayIndex - 1].push(modifiedPlace);

      newSelectedPlaces[dayIndex - 1].sort((a, b) => {
        if (a.time && b.time) {
          return a.time.localeCompare(b.time);
        }
        return 0;
      });

      return newSelectedPlaces;
    });
  };

  const removePlace = (dayIndex: number, placeIndex: number) => {
    setSelectedPlaces((prevSelectedPlaces) => {
      const newSelectedPlaces = [...prevSelectedPlaces];
      if (newSelectedPlaces[dayIndex - 1]) {
        newSelectedPlaces[dayIndex - 1].splice(placeIndex, 1);
      }
      return newSelectedPlaces;
    });
  };

  const generateSelectOptions = (days: number) => {
    const options = [];
    for (let i = 1; i <= days; i++) {
      options.push(
        <option key={i} value={i}>
          {`${i}일차`}
        </option>,
      );
    }
    return options;
  };

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const naviBack = () => {
    window.history.back();
  };

  const notifySuccess = () =>
    toast.success('장소가 성공적으로 추가되었습니다!', {
      position: 'top-center',
    });

  const notifyFail = () =>
    toast.error('장소 추가에 문제가 생겼습니다. 확인해주세요!', {
      position: 'top-center',
    });

  const addPlace = async () => {
    try {
      const postData = selectedPlaces.flatMap((innerArray, index) => {
        const startDate = new Date(tripdataRef.current.startDate);
        const currentDate = new Date(startDate);
        if (tripInfo.check === 0) {
          currentDate.setDate(startDate.getDate() + index + 1);
        } else {
          currentDate.setDate(startDate.getDate() + index);
        }
        return innerArray
          .map((place, innerIndex) => {
            return {
              placeId: place.placeId != null ? place.placeId : null,
              locationId: place.locationId,
              date: currentDate.toISOString().slice(0, 10),
              time: place.time,
            };
          })
          .filter((placeData) => placeData !== null);
      });

      await axios
        .post('/schedule/place/' + tripdataRef.current.scheduleId, postData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          notifySuccess();
          const id = setTimeout(() => {
            navigate('/mypage');
          }, 3000);
          setTimeoutId(id);
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
        notifyFail();
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
        notifyFail();
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
          differenceInTime / (1000 * 3600 * 24),
        );
        const tripDays = differenceInDays + 1;
        setTripDays(tripDays);

        await checkPlaces();
      }
    };

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
  }, [tripDays]);

  useEffect(() => {
    const placeOptions = {
      root: document.getElementById('scroll-container'),
      rootMargin: '20px',
      threshold: 0.8,
    };

    const placeCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        console.log('act', entry.isIntersecting);
        if (entry.isIntersecting) {
          if (searchTerm) {
            fetchPlaceDataOnScroll(activeDivision);
          } else {
            console.log('act', activeDivision);
            getData(activeDivision);
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
        if (placeLoadMoreRef.current) {
          placeObserver.current.unobserve(placeLoadMoreRef.current);
        }
        placeObserver.current.disconnect();
      }
    };
  }, [placeLoadMoreRef, location.search, lastIdx, activeDivision, divisions]);

  useEffect(() => {
    if (searchTerm) {
      fetchPlaceDataOnScroll(activeDivision);
    } else {
      console.log('act', activeDivision);
      getData(activeDivision);
    }
  }, [activeDivision]);

  useEffect(() => {
    setLastIdx(0);
    setRes([]);
    setDivisions({
      전체: [],
      음식점: [],
      문화시설: [],
      '축제 공연 행사': [],
      관광지: [],
      레포츠: [],
      숙박: [],
      쇼핑: [],
    });
    setLastPlaceIdx({
      전체: 0,
      음식점: 0,
      문화시설: 0,
      '축제 공연 행사': 0,
      관광지: 0,
      레포츠: 0,
      숙박: 0,
      쇼핑: 0,
    });
    if (activeDivision === '전체') {
      setActiveDivision('음식점');
    } else {
      setActiveDivision('전체');
    }
  }, [location.search]);

  const initialMarkers = activePlaces.map((place) => ({
    placeId: place.locationId,
    latitude: place.latitude,
    longitude: place.longitude,
  }));

  useEffect(() => {
    setKey(JSON.stringify(initialMarkers));
  }, [selectedPlaces, activeTab]);

  return (
    <div className="w-full h-[90%] flex">
      <ToastContainer />
      <div className="w-3/5 2xl:w-1/2 h-full flex">
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
          <div className="flex items-center h-[80%] flex-col">
            <div className="w-full whitespace-nowrap overflow-x-auto no-scrollbar flex justify-start h-9 min-h-9">
              {(Object.keys(divisions) as Array<keyof DivisionsType>).map(
                (division) => (
                  <button
                    key={division}
                    className={`py-1 px-2 mx-1 h-[95%] border rounded-full ${
                      activeDivision === division
                        ? 'bg-main-red-color text-white'
                        : 'bg-white text-main-red-color'
                    }`}
                    onClick={() => handleDivisionClick(division)}
                  >
                    {division}
                  </button>
                ),
              )}
            </div>
            <div
              id="scroll-container"
              className="w-11/12 grid grid-cols-2 flex flex flex-wrap justify-items-center gap-3 mt-1 overflow-y-auto"
            >
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
          <div className="flex flex-col w-full h-full border-4 border-[#FF9A9A] justify-between">
            <div className="select-container">
              <select
                className="day-select"
                value={activeTab}
                onChange={(e) => handleTabClick(Number(e.target.value))}
              >
                {generateSelectOptions(tripDays)}
              </select>
            </div>
            <div className="tab-content h-[80%] overflow-y-scroll flex flex-col">
              {Array.from({ length: tripDays }, (_, tabIndex) => (
                <div
                  key={tabIndex + 1}
                  id={`content${tabIndex + 1}`}
                  className={`content ${
                    activeTab === tabIndex + 1 ? 'active' : ''
                  }`}
                >
                  <div className="contentBox">
                    {selectedPlaces[activeTab - 1] && (
                      <div className="w-full h-full flex flex-col items-center pt-3">
                        {selectedPlaces[activeTab - 1].map(
                          (selectedPlace, index) => (
                            <DayPlace
                              key={index}
                              dayIndex={activeTab}
                              placeIndex={index}
                              selectedPlace={selectedPlace}
                              removePlace={(dayIndex, placeIndex) =>
                                removePlace(dayIndex, placeIndex)
                              }
                              onTimeChange={handleTimeChange}
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
      <MapProvider
        key={key}
        initialCenter={initialCenter}
        initialMarkers={initialMarkers}
      >
        <Map isLine={true} isClicked={false} />
      </MapProvider>
    </div>
  );
};

export default MakePlan;
