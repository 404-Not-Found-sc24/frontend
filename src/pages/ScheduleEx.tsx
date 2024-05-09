import React, { useEffect, useState } from 'react';
import Map from '../components/Map';
import PlanDetailBox from '../components/PlanDetailBox';
import { MapProvider } from '../context/MapContext';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

interface ScheduleData {
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

const ScheduleEx: React.FC = () => {
  const location = useLocation();
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [tripDays, setTripDays] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [res, setRes] = useState([]);
  const plan = location.state.plan;
  const queryParams = new URLSearchParams(location.search);
  const scheduleId = queryParams.get('scheduleId');
  const startDate = new Date(plan.startDate);
  const endDate = new Date(plan.endDate);
  const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

  // Tab 생성
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
        setScheduleData(response.data);
        setLoading(false);
      } catch (error) {
        setError('일정 데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, [scheduleId]);

  const copySchedule = async () => {
    try {
      // 복사된 일정 데이터를 MyPlan 페이지로 전달하고 페이지를 이동합니다.
      navigate('/myplan', { state: { copiedSchedule: scheduleData } });
    } catch (error) {
      console.error('일정을 복사하는 중 오류가 발생했습니다:', error);
      // 에러 처리 (예: 사용자에게 알림)
    }
  };

  const handleTabClick = (tab: number) => {
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
              <button
                onClick={copySchedule}
                className="w-20 h-7 bg-black rounded-2xl text-white font-['Nanum Gothic'] text-sm font-semibold"
              >
                가져오기
              </button>
            </div>
            {Array.from({ length: diffDays }, (_, index) => (
              <div key={index}>
                {activeTab === index + 1 && (
                  <div>
                    {scheduleData
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

export default ScheduleEx;
