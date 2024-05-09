import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScheduleCard from '../components/ScheduleCard';
import { useAuth } from '../context/AuthContext';
import axios, { AxiosError } from 'axios';
import { ToastContainer, toast } from 'react-toastify';

interface ScheduleData {
  scheduleId: number;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  share: number;
  imageUrl: string;
}

const MyPage: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduleData[]> ([]);


  const { accessToken, refreshAccessToken  } = useAuth();


  useEffect(() => {
    getSchedules();
  }, []);

  const getSchedules = async () => {
    try {
      const response = await axios.get('/schedule', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setSchedules(response.data);

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
        console.error('일정 조회 중 오류 발생:', error);
      }
    }
  }

  return (
    <div>
      <div className='h-[22rem]'>
        <div className='w-full h-44 bg-main-red-color'>
        </div>
        <div className='relative flex justify-center'>
          <img src={`${process.env.PUBLIC_URL}/image/user.png`} alt="유저 기본 이미지" className='absolute w-24 h-24 -top-10 bg-white rounded-full'></img>
          <h1 className='absolute top-16 text-3xl font-medium'>나영이</h1>
          <Link
            to="/"
            className="text-ms text-main-green-color font-Nanum Gothic underline underline-offset-4 absolute top-28"
          >
            사용자 설정
          </Link>
        </div>
      </div>
      <div className='flex justify-center '>
        <div className='w-3/4'>
          <div className='flex flex-row justify-between mb-5'>
            <div className='flex flex-row'>
              <div className='bg-main-red-color w-[0.3rem] h-8 rounded'></div>
              <h1 className='text-3xl font-medium mx-3'>나의 일정</h1>
              <h1 className='text-3xl font-medium text-main-red-color'>{schedules.length}</h1>
            </div>
            <button className='bg-main-red-color text-white rounded-full px-3 py-1'>+ 일정 추가</button>
          </div>
          <div>
            {schedules.length > 0 ?
              <div>
                {schedules.map((data: ScheduleData, index: number) => {
                  return (
                    <div className="w-full h-full flex flex-col items-center pt-3">
                      <ScheduleCard key={index} props={data} />
                    </div>
                  );
                })}</div>

              :
              <div className='flex justify-center items-center h-44 shadow-md'>
                <div className='text-slate-300 font-bold text-3xl'>
                  등록된 일정이 없습니다.
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div >
  );
};

export default MyPage;