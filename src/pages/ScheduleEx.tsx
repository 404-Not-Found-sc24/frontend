import React, { useEffect, useState } from 'react';
import Map from '../components/Map';
import PlanDetailBox from '../components/PlanDetailBox';
import { MapProvider } from '../context/MapContext';
import axios, { AxiosError } from 'axios';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';

interface ScheduleData {
  placeId: number;
  locationId: number;
  locationName: string;
  date: string;
  time: string;
  diaryId: number;
  title: string;
  content: string;
  images: { imageUrl: string }[];
}

const ScheduleEx: React.FC = () => {
  const location = useLocation();
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([]);
  const [activeTab, setActiveTab] = useState<number>(1);
  const plan = location.state.plan;
  const queryParams = new URLSearchParams(location.search);
  const scheduleId = queryParams.get('scheduleId');
  const startDate = new Date(plan.startDate);
  const endDate = new Date(plan.endDate);
  const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  const { refreshAccessToken } = useAuth();
  const accessToken = localStorage.getItem('accessToken');

  const notifySuccess = () =>
    toast.success('일정이 성공적으로 저장되었습니다.', {
      position: 'top-center',
    });
  const notifyError = () =>
    toast.error('일정 작성 중 오류가 발생했습니다.', {
      position: 'top-center',
    });
  const handleTabClick = (tab: number) => {
    setActiveTab(tab);
  };
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
        const response = await axios.get(`/schedule/schedules/${scheduleId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setScheduleData(response.data);
      } catch (error) {
        if (
          (error as AxiosError).response &&
          (error as AxiosError).response?.status === 401
        ) {
          try {
            await refreshAccessToken();
            // 새로운 액세스 토큰으로 다시 요청을 보냅니다.
            // 여기에서는 재시도 로직을 추가할 수 있습니다.
          } catch (refreshError) {
            console.error('Failed to refresh access token:', refreshError);
            // 액세스 토큰 갱신에 실패한 경우 사용자에게 알립니다.
          }
        } else {
          console.error(
            '일정 데이터를 불러오는 중 오류가 발생했습니다.',
            error,
          );
        }
      }
    };

    fetchScheduleData();
  }, [scheduleId]);

  const copySchedule = async () => {
    try {
      // 복사된 일정 데이터를 서버에 전송하여 저장합니다.
      const response = await axios.post(
        `/tour/schedules/${scheduleId}`,
        { name: plan.name, startDate: plan.startDate, endDate: plan.endDate },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      // 저장이 완료되면 사용자에게 알립니다. (예: 모달, 알림 등)
      console.log('일정이 성공적으로 복사되었습니다:', response.data);
      notifySuccess();
    } catch (error) {
      if (
        (error as AxiosError).response &&
        (error as AxiosError).response?.status === 401
      ) {
        try {
          await refreshAccessToken();
          // 새로운 액세스 토큰으로 다시 요청을 보냅니다.
          // 여기에서는 재시도 로직을 추가할 수 있습니다.
        } catch (refreshError) {
          console.error('Failed to refresh access token:', refreshError);
          notifyError();
          // 액세스 토큰 갱신에 실패한 경우 사용자에게 알립니다.
        }
      } else {
        console.error('일정 복사 중 오류 발생:', error);
        notifyError();
      }
    }
  };

  const naviBack = () => {
    window.history.back();
  };

  return (
    <div className="flex w-full h-[864px]">
      <ToastContainer />
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
                일정 복사
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
