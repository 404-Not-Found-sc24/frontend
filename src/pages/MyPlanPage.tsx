import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapProvider } from '../context/MapContext';
import Map from '../components/Map';
import PlanDetailBox from '../components/PlanDetailBox';
import axios from 'axios';

interface PlanData {
  placeId: number;
  locationId: number;
  locationName: string;
  date: string;
  time: string;
  recordId: number;
  title: string;
  content: string;
  images: { imageUrl: string }[];
}

const MyPlanPage: React.FC = () => {
  const location = useLocation();
  const plan = location.state.data;
  const scheduleId = location.state.data.scheduleId;
  const [activeTab, setActiveTab] = useState<number>(1);
  const { accessToken, refreshAccessToken } = useAuth();
  const [planData, setPlanData] = useState<PlanData[]>([]);
  const startDate = new Date(plan.startDate);
  const endDate = new Date(plan.endDate);
  const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

  const handleTabClick = (tab: number) => {
    setActiveTab(tab);
  };
  const generateTabs = () => {
    const tabs = [];
    for (let i = 1; i <= diffDays; i++) {
      tabs.push(
        <button
          key={i}
          className={`w-16 h-full bg-[#FF9A9A] rounded-2xl text-white font-['BMJUA'] text-sm mr-2 ${
            activeTab === i ? '' : 'opacity-50'
          }`}
          onClick={() => handleTabClick(i)}
        >
          {`${i}일차`}
        </button>,
      );
    }
    return tabs;
  };

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const response = await axios.get(`/schedule/schedules/${scheduleId}`);
        setPlanData(response.data);
      } catch (error) {
        console.error('일정 데이터를 불러오는 중 오류가 발생했습니다.', error);
      }
    };

    fetchScheduleData();
  }, [scheduleId]);

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
              {plan.name}
            </div>
            <div className="font-['BMJUA'] text-xl text-[#ED661A] ml-5 flex items-center">
              {plan.startDate} ~ {plan.endDate}
            </div>
          </div>
        </div>
        <div className="w-full h-[810px] flex justify-center">
          <div className="w-11/12 h-full pt-3 pb-5 flex flex-col">
            <div className="flex justify-between h-7">
              <div className="flex items-center">{generateTabs()}</div>
              <button className="w-20 h-7 bg-black rounded-2xl text-white font-['Nanum Gothic'] text-sm font-semibold">
                일정 편집
              </button>
            </div>
            {Array.from({ length: diffDays }, (_, index) => (
              <div key={index}>
                {activeTab === index + 1 && (
                  <div>
                    {planData
                      .filter(
                        (data) =>
                          Math.ceil(
                            Math.abs(
                              new Date(data.date).getTime() -
                                startDate.getTime(),
                            ) /
                              (1000 * 3600 * 24) +
                              1,
                          ) ===
                          index + 1,
                      )
                      .map((filteredData, dataIndex) => (
                        <PlanDetailBox
                          key={dataIndex}
                          scheduleData={filteredData}
                        />
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <MapProvider initialCenter={{ latitude: 37.2795, longitude: 127.0438 }}>
        <Map />
      </MapProvider>
    </div>
  );
};

export default MyPlanPage;
