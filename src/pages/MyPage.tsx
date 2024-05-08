import React from 'react';
import { Link } from 'react-router-dom';
import ScheduleCard from '../components/ScheduleCard';

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
  const schedules: ScheduleData[] =  [
    {
      "scheduleId": 2,
      "name": "나영이의 서울 탐험",
      "location": "서울특별시",
      "startDate": "2024-05-07",
      "endDate": "2024-05-10",
      "share": 1,
      "imageUrl": "{`${process.env.PUBLIC_URL}/image/image 15.png`}"
    },
    {
      "scheduleId": 2,
      "name": "나영이의 서울 탐험",
      "location": "서울특별시",
      "startDate": "2024-05-07",
      "endDate": "2024-05-10",
      "share": 0,
      "imageUrl": "{`${process.env.PUBLIC_URL}/image/image 15.png`}"
    },
  ]

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
            { schedules.length > 0 ?
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