import * as React from 'react';
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import '../index.css';
import PlaceBox from "../components/PlaceBox";
import DayPlace from "../components/DayPlace";

declare global {
    interface Window {
        kakao: any;
    }
}

const MakePlan = () => {
    const location = useLocation();
    const tripInfo = { ...location.state };
    const navigate = useNavigate();
    const [tripDays, setTripDays] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<number>(1); // 활성화된 탭의 인덱스를 관리하는 상태

    const generateTabs = (days: number) => {
        const tabs = [];
        for (let i = 1; i <= days; i++) {
            tabs.push(
                <div key={i} className={`tab ${activeTab === i ? 'active' : ''}`} onClick={() => handleTabClick(i)}>
                    <div className="tabContent">
                        {`${i}일차`}
                    </div>
                </div>
            );
        }
        return tabs;
    };

    const handleTabClick = (index: number) => {
        console.log(index);
        setActiveTab(index); // 클릭한 탭의 인덱스를 상태로 설정
    };

    useEffect(() => {
        if (tripInfo.startDate && tripInfo.endDate) {
            const differenceInTime = tripInfo.endDate.getTime() - tripInfo.startDate.getTime();
            const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
            const tripDays = differenceInDays + 1;
            setTripDays(tripDays);
        }
    }, []);

    useEffect(() => {
        const container = document.getElementById("map");
        const options = {
            center: new window.kakao.maps.LatLng(37.2795, 127.0438),
            level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);

        const positions = [
            {
                title: '모각소',
                latlng: new window.kakao.maps.LatLng(37.2795, 127.0438)
            },
            {
                title: 'test',
                latlng: new window.kakao.maps.LatLng(37.2785, 127.0428)
            }
        ];
        for (var i = 0; i < positions.length; i++) {
            const marker = new window.kakao.maps.Marker({
                map: map,
                position: positions[i].latlng,
                title: positions[i].title,
            });
        }
    }, []);

    const naviBack = () => {
        navigate('/');
    };

    return (
        <div className="w-full h-[864px] flex">
            <div className="w-1/2 h-full flex">
                <div className="w-1/2 h-full flex flex-col">
                    <div className="flex">
                        <i className="backArrow ml-2 cursor-pointer" onClick={naviBack}></i>
                        <div
                            className="font-['Nanum Gothic'] text-3xl font-semibold text-black ml-2 w-72 flex items-center">{tripInfo.city}</div>
                    </div>
                    <form className="flex items-center max-w-2xl mx-5 mt-5">
                        <label htmlFor="simple-search" className="sr-only">
                            Search
                        </label>
                        <div className="relative w-full">
                            <div
                                className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
                            <input
                                type="text"
                                id="simple-search"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 font-BMJUA"
                                placeholder="궁금한 여행지를 검색해보세요!"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            <svg
                                className="w-4 h-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                            <span className="sr-only">Search</span>
                        </button>
                    </form>
                    <div className="grid grid-cols-2 justify-items-center items-center gap-3 mt-4">
                        {/*{cityList.map((tripInfo.city, index: number) => (
                            <PlaceBox key={index} city={tripInfo.city} />
                        ))}*/}
                        <PlaceBox />
                    </div>
                </div>
                <div className="w-1/2 h-full flex">
                    <div className="tabs w-[40px]">
                        {generateTabs(tripDays)}
                    </div>
                    <div className="tab-content w-full h-full border-4 border-[#FF9A9A]">
                        {Array.from({length: tripDays}, (_, index) => (
                            <div key={index + 1} id={`content${index + 1}`} className={`content ${activeTab === index + 1 ? 'active' : ''}`}>
                                <div className="contentBox">
                                    <div className="w-full h-full flex flex-col items-center pt-3">
                                        <DayPlace />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div id="map" className="w-1/2"></div>
        </div>
    );
};

export default MakePlan;