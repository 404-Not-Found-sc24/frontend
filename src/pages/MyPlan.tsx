import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { MapProvider } from '../context/MapContext';
import Map from '../components/Map';

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

const MyPlan: React.FC = () => {
  const location = useLocation();
  const [copiedSchedule, setCopiedSchedule] = useState<ScheduleData[] | null>(
    null,
  );
  const { accessToken, refreshAccessToken } = useAuth();

  const notifySuccess = () =>
    toast.success('일정이 성공적으로 저장되었습니다.', {
      position: 'top-center',
    });
  const notifyError = () =>
    toast.error('일정 작성 중 오류가 발생했습니다.', {
      position: 'top-center',
    });

  // MyPlan 페이지가 마운트될 때 복사된 일정 데이터를 확인합니다.
  useEffect(() => {
    const copiedData = location.state?.copiedSchedule;
    if (copiedData) {
      setCopiedSchedule(copiedData);
    }
  }, [location.state?.copiedSchedule]);

  // 복사된 일정을 서버에 저장하는 함수
  const saveCopiedSchedule = async () => {
    if (!copiedSchedule) return;

    try {
      // 복사된 일정 데이터를 서버에 전송하여 저장합니다.
      const response = await axios.post('/tour/schedule/2', copiedSchedule, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // 저장이 완료되면 사용자에게 알립니다. (예: 모달, 알림 등)
      console.log('일정이 성공적으로 저장되었습니다:', response.data);
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
        console.error('일정 저장 중 오류 발생:', error);
        notifyError();
      }
    }
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
            <div className="font-['BMJUA'] text-3xl text-black ml-2 flex items-center"></div>
            <div className="font-['BMJUA'] text-xl text-[#ED661A] ml-5 flex items-center"></div>
          </div>
        </div>
        <div className="w-full h-[810px] flex justify-center">
          <div className="w-11/12 h-full pt-3 pb-5 flex flex-col">
            {copiedSchedule ? (
              <div>
                <h2>복사된 일정</h2>
                {copiedSchedule.map((scheduleItem, index) => (
                  <div key={index} className="mb-5">
                    <h3>{scheduleItem.title}</h3>
                    <div>
                      {scheduleItem.date} {scheduleItem.time}
                    </div>
                    <div>장소: {scheduleItem.locationName}</div>
                    <div>내용: {scheduleItem.content}</div>
                    {scheduleItem.images &&
                      scheduleItem.images.map((image, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={image.imageUrl}
                          alt={`Image ${imgIndex}`}
                          className="w-32 h-32 object-cover rounded-lg mt-2"
                        />
                      ))}
                  </div>
                ))}
                <button
                  onClick={saveCopiedSchedule}
                  className="w-32 h-10 bg-black rounded-2xl text-white text-sm font-semibold mt-5"
                >
                  일정 저장
                </button>
              </div>
            ) : (
              <div>복사된 일정이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
      <MapProvider initialCenter={{ latitude: 37.2795, longitude: 127.0438 }}>
        <Map />
      </MapProvider>
    </div>
  );
};

export default MyPlan;
