import * as React from 'react';
import {useEffect, useMemo, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import '../index.css';
import PlaceBox from '../components/PlaceBox';
import DayPlace from '../components/DayPlace';
import axios, {AxiosError} from 'axios';
import Place from '../../types/Place';
import SearchBar from '../components/SearchBar';
import Map from '../components/Map';
import {MapProvider} from '../context/MapContext';
import {useAuth} from "../context/AuthContext";
import {toast, ToastContainer} from "react-toastify";

const MakePlan = () => {
    const location = useLocation();
    const tripInfo = {...location.state};
    const navigate = useNavigate();
    const [tripDays, setTripDays] = useState<number>(0);
    const [keyword, setKeyword] = useState('');
    const [lastIdx, setLastIdx] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<number>(1);
    const [res, setRes] = useState([]);
    const [selectedPlaces, setSelectedPlaces] = useState<Place[][]>([]);
    const {accessToken, refreshAccessToken} = useAuth();

    console.log(tripInfo);

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
                {length: tripDays},
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
  
    const getData = async () => {
        console.log(tripInfo.city);
        console.log(keyword);
        try {
            await axios
                .get('tour/locations?city=' + tripInfo.city + '&keyword=' + keyword + '&lastIdx=' + lastIdx, {
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

    const notifySuccess = () =>
        toast.success('장소가 성공적으로 추가되었습니다!', {
            position: 'top-center',
        });

    const addPlace = async () => {
        try {
            const postData = selectedPlaces.flatMap((innerArray, index) => {
                const startDate = new Date(tripInfo.startDate);
                console.log(startDate);
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + index + 1); // 시작 날짜에 인덱스를 더한 값
                console.log(currentDate);

                return innerArray.map((place, innerIndex) => ({
                    placeId: innerIndex, // 내부 배열의 인덱스를 placeId로 사용
                    locationId: place.locationId,
                    date: currentDate.toISOString().slice(0, 10), // ISO 형식으로 변환하여 날짜만 추출
                    time: "00:00", // 예시: 방문 예정 시간
                }));
            });


            console.log(postData);
            await axios
                .post('/schedule/place/' + tripInfo.scheduleId, postData, {
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
            }
        }
    };

    return (
        <div className="w-full h-[864px] flex">
            <ToastContainer />
            <div className="w-1/2 h-full flex">
                <div className="w-1/2 h-full flex flex-col">
                    <div className="flex">
                        <i className="backArrow ml-2 cursor-pointer" onClick={naviBack}></i>
                        <div
                            className="font-['Nanum Gothic'] text-3xl font-semibold text-black ml-2 w-72 flex items-center">{tripInfo.city}</div>
                    </div>
                    <SearchBar/>
                    <div className="flex justify-center h-[720px] overscroll-y-auto">
                        <div className="w-11/12 grid grid-cols-2 justify-items-center items-center gap-3 mt-4 overflow-y-auto">
                            {res.map((place: Place, index: number) => (
                                <PlaceBox key={index} place={place}
                                          addSelectedPlace={() => addSelectedPlace(place, activeTab)}/>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-1/2 h-full flex">
                    <div className="tabs w-[40px]">
                        {generateTabs(tripDays)}
                    </div>
                    <div className="flex flex-col w-full h-full border-4 border-[#FF9A9A] justify-between">
                        <div className="tab-content">
                            {Array.from({length: tripDays}, (_, tabIndex) => (
                                <div
                                    key={tabIndex + 1}
                                    id={`content${tabIndex + 1}`}
                                    className={`content ${activeTab === tabIndex + 1 ? 'active' : ''}`}
                                >
                                    <div className="contentBox">
                                        {selectedPlaces && (
                                            <div className="w-full h-full flex flex-col items-center pt-3">
                                                {selectedPlaces[activeTab - 1].map((selectedPlace, index) => (
                                                    <DayPlace
                                                        key={index}
                                                        index={index}
                                                        selectedPlace={selectedPlace}
                                                        removePlace={() => removePlace(activeTab, index)}
                                                    />
                                                ))}
                                            </div>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="h-[100px] w-full flex justify-center items-center">
                            <button className="h-1/2 bg-black text-white px-10 rounded-md text-xl font-['BMJUA']"
                            onClick={addPlace}>추가</button>
                        </div>
                    </div>
                </div>
            </div>
            {/*<MapProvider initialCenter={{latitude: 37.2795, longitude: 127.0438}}>
                <Map/>
            </MapProvider>*/}
        </div>
    );
};
export default MakePlan;