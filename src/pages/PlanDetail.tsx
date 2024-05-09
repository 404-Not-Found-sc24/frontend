import React, { useState } from 'react';
import Map from '../components/Map';
import PlanDetailBox from '../components/PlanDetailBox';
import { MapProvider } from '../context/MapContext';

const PlanDetail: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const naviBack = () => {
    window.history.back();
  };

  return (
    <div className="flex w-full h-[864px]">
      <div className="w-1/2 h-full">
        <div className="flex">
          <i className="backArrow ml-2 cursor-pointer" onClick={naviBack}></i>
          <div className="flex items-center">
            <div className="font-['BMJUA'] text-3xl text-black ml-2 flex items-center">
              여행 이름
            </div>
            <div className="font-['BMJUA'] text-xl text-[#ED661A] ml-5 flex items-center">
              여행 날짜
            </div>
          </div>
        </div>
        <div className="w-full h-[810px] flex justify-center">
          <div className="w-11/12 h-full pt-3 pb-5 flex flex-col">
            <div className="flex justify-between h-7">
              <div className="flex items-center">
                <button
                  className={`w-16 h-full bg-[#FF9A9A] rounded-2xl text-white font-['BMJUA'] text-sm mr-2 ${
                    activeTab === '1' ? '' : 'opacity-50'
                  }`}
                  onClick={() => handleTabClick('1')}
                >
                  1일차
                </button>
                <button
                  className={`w-16 h-full bg-[#A6DCA3] rounded-2xl text-white font-['BMJUA'] text-sm mr-2 ${
                    activeTab === '2' ? '' : 'opacity-50'
                  }`}
                  onClick={() => handleTabClick('2')}
                >
                  2일차
                </button>
                <button
                  className={`w-16 h-full bg-[#8CD3FF] rounded-2xl text-white font-['BMJUA'] text-sm mr-2 ${
                    activeTab === '3' ? '' : 'opacity-50'
                  }`}
                  onClick={() => handleTabClick('3')}
                >
                  3일차
                </button>
              </div>
              <button className="w-20 h-7 bg-black rounded-2xl text-white font-['Nanum Gothic'] text-sm font-semibold">
                가져오기
              </button>
            </div>
            {activeTab === '1'}
            {activeTab === '2'}
            {activeTab === '3'}
          </div>
        </div>
      </div>
      <MapProvider initialCenter={{ latitude: 37.2795, longitude: 127.0438 }}>
        <Map />
      </MapProvider>
    </div>
  );
};

export default PlanDetail;
