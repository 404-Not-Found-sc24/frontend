import React, { useEffect, useState } from 'react';
import Map from '../components/Map';
import { MapProvider } from '../context/MapContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Diary {
  userName: string;
  title: string;
  date: string;
  weather: string;
  content: string;
  imageUrl: string;
}

const DiaryDetail: React.FC = () => {
  const location = useLocation();
  const Diary = location.state.PlanData;
  const [Diarydata, setDiaryData] = useState<Diary[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const naviBack = () => {
    window.history.back();
  };

  const getData = async () => {
    console.log(Diary);
    try {
      await axios
        .get(`/tour/diary/${Diary.diaryId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log(response.data);
          setDiaryData(response.data);
        });
    } catch (e) {
      console.error('Error:', e);
    }
  };

  return (
    <div className="flex w-full h-[864px]">
      <div className="w-1/2 h-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <i className="backArrow ml-2 cursor-pointer" onClick={naviBack}></i>
            <div className="font-['BMJUA'] text-3xl text-black ml-2 flex items-center">
              {Diary.title}
            </div>
            <div className="font-['BMJUA'] text-xl text-[#ED661A] ml-5 flex items-center">
              {Diary.date}
            </div>
          </div>
        </div>
        <div className="w-full h-[800px] flex justify-center">
          <div className="w-5/6 h-full mb-5">
            <div className="w-full h-full flex flex-col pt-3">
              <div className="w-full h-[95%] flex flex-col py-5 rounded-md shadow-xl">
                <div className="flex justify-between h-[10%] mx-5 items-center">
                  <div className="flex w-[50%] items-center">
                    <div className="font-['BMJUA'] text-[#FF9A9A] text-xl mr-5">
                      11:00
                    </div>
                    <div className="font-['BMJUA'] text-2xl">장소 이름</div>
                  </div>
                  <button className="w-20 h-7 bg-black rounded-2xl text-white font-['Nanum Gothic'] text-sm font-semibold">
                    가져오기
                  </button>
                </div>
                <div className="flex justify-center h-fit m-5">
                  <img
                    src={Diary.imageUrl}
                    width="400px"
                    height="300px"
                    alt="지역소개사진"
                  ></img>
                </div>
                <div className="mx-10 my-5 h-full">
                  <div className="flex justify-between">
                    <div className="font-['Nanum Gothic'] font-bold text-lg">
                      {Diary.title}
                    </div>
                    <div>{Diary.weather}</div>
                  </div>
                  <div className="font-['Nanum Gothic'] mt-3">
                    {Diary.content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*<MapProvider initialCenter={{ latitude: 37.2795, longitude: 127.0438 }}>
        <Map />
      </MapProvider>*/}
    </div>
  );
};

export default DiaryDetail;
