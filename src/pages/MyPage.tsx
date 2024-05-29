import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ScheduleCard from '../components/ScheduleCard';
import { useAuth } from '../context/AuthContext';
import axios, { AxiosError } from 'axios';

interface ScheduleData {
  scheduleId: number;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  share: number;
  imageUrl: string;
}

interface UserInfo {
  memberId: number;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  role: string;
  imageUrl: string;
}

const MyPage: React.FC = () => {
  const [beforeTravel, setBeforeTravel] = useState<ScheduleData[]>([]);
  const [traveling, setTraveling] = useState<ScheduleData[]>([]);
  const [afterTravel, setAfterTravel] = useState<ScheduleData[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'여행 전' | '여행 중' | '여행 후'>(
    '여행 전',
  );
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);

  const { refreshAccessToken } = useAuth();
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const tabs = useMemo(
    () => [
      { label: '여행 전', key: 'beforeTravel' },
      { label: '여행 중', key: 'traveling' },
      { label: '여행 후', key: 'afterTravel' },
    ],
    [],
  );

  const getSchedules = async () => {
    try {
      const response = await axios.get('/schedule', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setBeforeTravel(response.data.beforeTravel);
      setTraveling(response.data.traveling);
      setAfterTravel(response.data.afterTravel);
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
        console.error('일정 조회 중 오류 발생:', error);
      }
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await axios.get('/auth', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUserInfo(response.data);
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
        console.error('일정 조회 중 오류 발생:', error);
      }
    }
  };

  const navigateToTravel = (curr: string) => {
    navigate('/traveldes', {
      state: {
        curr: curr,
      },
    });
  };

  const navigateToSetting = (data: UserInfo) => {
    navigate('/mypage-setting', { state: { data } });
  };

  const onDeleteSchedule = (scheduleId: number) => {
    setShowSuccessPopup(true);
    if (activeTab === '여행 전') {
      const updatedSchedules = beforeTravel.filter(
        (schedule) => schedule.scheduleId !== scheduleId,
      );
      setBeforeTravel(updatedSchedules);
    } else if (activeTab === '여행 중') {
      const updatedSchedules = traveling.filter(
        (schedule) => schedule.scheduleId !== scheduleId,
      );
      setTraveling(updatedSchedules);
    } else if (activeTab === '여행 후') {
      const updatedSchedules = afterTravel.filter(
        (schedule) => schedule.scheduleId !== scheduleId,
      );
      setAfterTravel(updatedSchedules);
    }
  };

  useEffect(() => {
    getSchedules();
    getUserInfo();
  }, [refreshAccessToken]);

  const renderScheduleCards = (
    scheduleData: ScheduleData[],
    onDeleteSchedule: (scheduleId: number) => void,
  ) => {
    return (
      <div>
        {scheduleData.map((data: ScheduleData, index: number) => {
          return (
            <div
              className="w-full h-full flex flex-col items-center pt-3"
              key={index}
            >
              <ScheduleCard data={data} onDeleteSchedule={onDeleteSchedule} />
            </div>
          );
        })}
      </div>
    );
  };

  const handlePopupClose = () => {
    setShowSuccessPopup(false);
  };

  const scheduleData = useMemo(() => {
    const scheduleMap: {
      [key in '여행 전' | '여행 중' | '여행 후']: ScheduleData[];
    } = {
      '여행 전': beforeTravel,
      '여행 중': traveling,
      '여행 후': afterTravel,
    };
    return scheduleMap[activeTab] || [];
  }, [activeTab, beforeTravel, traveling, afterTravel]);

  return (
    <div>
      <div className="h-[22rem]">
        <div className="w-full h-44 bg-main-red-color"></div>
        <div className="relative flex justify-center">
          {userInfo?.imageUrl == null ? (
            <img
              src={`${process.env.PUBLIC_URL}/image/user.png`}
              alt="유저 기본 이미지"
              className="absolute w-24 h-24 -top-10 bg-white rounded-full"
            />
          ) : (
            <img
              src={userInfo.imageUrl}
              alt="유저 프로필 이미지"
              className="absolute w-24 h-24 -top-10 bg-white rounded-full"
            />
          )}
          <h1 className="absolute top-16 text-3xl font-medium">
            {userInfo?.nickname}
          </h1>
          <button
            onClick={() => {
              if (userInfo) {
                navigateToSetting(userInfo);
              } else {
                console.log('User info is not available');
              }
            }}
            className="text-ms text-main-green-color font-Nanum Gothic underline underline-offset-4 absolute top-28"
          >
            사용자 설정
          </button>
        </div>
      </div>
      <div className="flex justify-center ">
        <div className="w-3/4 mb-5">
          <div className="flex flex-row justify-between mb-5">
            <div className="flex flex-row">
              <div className="bg-main-red-color w-[0.3rem] h-8 rounded"></div>
              <h1 className="text-3xl font-medium mx-3">나의 일정</h1>
              <h1 className="text-3xl font-medium text-main-red-color">
                {beforeTravel.length + traveling.length + afterTravel.length}
              </h1>
            </div>
            <button
              className="bg-main-red-color text-white rounded-full px-3 py-1"
              onClick={() => navigateToTravel('schedule')}
            >
              + 일정 추가
            </button>
          </div>
          <div className="w-full flex justify-center">
            <div className="flex pt-4 w-full">
              {tabs.map((tab) => (
                <div
                  key={tab.key}
                  className={`mx-auto justify-center py-2 text-center w-1/2 border-main-red-color font-BMJUA text-2xl cursor-pointer ${
                    activeTab === tab.label
                      ? 'border-x-2 border-t-2 rounded-t-lg text-main-red-color'
                      : 'border-b-2'
                  }`}
                  onClick={() =>
                    setActiveTab(tab.label as '여행 전' | '여행 중' | '여행 후')
                  }
                >
                  {tab.label}
                </div>
              ))}
            </div>
          </div>
          <div>
            {scheduleData.length > 0 ? (
              renderScheduleCards(scheduleData, onDeleteSchedule)
            ) : (
              <div className="flex justify-center items-center h-44 shadow-md">
                <div className="text-slate-300 font-bold text-3xl">
                  {activeTab === '여행 전' && '계획 중인 여행이 없습니다.'}
                  {activeTab === '여행 중' && '여행 중인 일정이 없습니다.'}
                  {activeTab === '여행 후' && '종료된 여행이 없습니다.'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showSuccessPopup && (
        <div className="popup absolute top-0 l-0 w-full h-full bg-black/50 flex justify-center">
          <div className="bg-white p-3 rounded mt-10 w-1/3 h-36 flex items-center flex-col">
            <div className="h-24 flex items-center">일정이 삭제되었습니다.</div>
            <button
              onClick={handlePopupClose}
              className="w-16 text-white bg-main-red-color py-0.5 px-3"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
