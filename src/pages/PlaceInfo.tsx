import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // useLocation을 이용하여 현재 URL 정보 가져오기
import SearchResults from '../components/SearchResults';
import placedata from '../placedata'; // 추가된 장소 데이터 파일
import plandata from '../plandata'; // 일정 데이터 파일
import SearchBar from '../components/SearchBar';
import Map from '../components/Map';
import PlanBox from '../components/PlanBox';


const PlaceInfo: React.FC = () => {
    const [activeTab, setActiveTab] = useState('장소 소개');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const location = useLocation(); // 현재 URL 정보 가져오기

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const naviBack = () => {
        window.history.back();
    };

    return (
        <div className="flex w-full h-[864px]">
            <div className="w-1/2 h-full">
                <i className="absolute backArrow ml-2 cursor-pointer" onClick={naviBack}></i>
                <div className="w-full flex justify-center mt-5">
                    <div className="w-5/6">
                        <SearchBar/>
                    </div>
                </div>
                <div className="flex max-w-2xl mx-auto pt-4">
                    <div
                        id="1"
                        className={`mx-auto justify-center py-2 text-center w-1/2 border-main-red-color font-BMJUA text-2xl cursor-pointer ${
                            activeTab === '장소 소개'
                                ? 'border-x-2 border-t-2 rounded-t-lg text-main-red-color'
                                : 'border-b-2'
                        }`}
                        onClick={() => handleTabClick('장소 소개')}
                    >
                        장소 소개
                    </div>
                    <div
                        id="2"
                        className={`mx-auto justify-center py-2 text-center w-1/2 border-main-red-color font-BMJUA text-2xl cursor-pointer ${
                            activeTab === '일기 보기'
                                ? 'border-x-2 border-t-2 rounded-t-lg text-main-red-color'
                                : 'border-b-2'
                        }`}
                        onClick={() => handleTabClick('일기 보기')}
                    >
                        일기 보기
                    </div>
                    <div
                        id="3"
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
                <div className="w-full h-[685px] flex justify-center">
                    <div className="w-[672px] h-full mb-5">
                        {activeTab === '장소 소개' && (
                            <div className="w-full h-full flex flex-col items-center pt-3">
                                <div className="w-full h-[95%] flex justify-center py-5 rounded-md shadow-xl">
                                    <img src="" width="400px" alt="지역소개사진"></img>
                                    {/* 세부 사항 넣기 */}
                                </div>
                            </div>
                        )}
                        {activeTab === '일기 보기' && (
                            <></>
                        )}
                        {activeTab === '일정 보기' && (
                            <div className="w-full h-full flex flex-col items-center pt-3">
                                <PlanBox/>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Map/>
        </div>
    );
};

export default PlaceInfo;