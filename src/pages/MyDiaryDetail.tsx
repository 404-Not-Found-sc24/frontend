import React, { useEffect, useState } from 'react';
import Map from '../components/Map';
import { MapProvider } from '../context/MapContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface PlanData {
  placeId: number;
  locationId: number;
  locationName: string;
  date: string;
  time: string;
  diaryId: number;
  title: string;
  content: string;
  imageUrl: string;
}

interface Diary {
  userName: string;
  title: string;
  date: string;
  weather: string;
  content: string;
  imageUrl: string;
}

const MyDiaryDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const PlanData = location.state.PlanData;
  const planName = location.state.planName;
  const [Diarydata, setDiaryData] = useState<Diary[]>([]);

  const getData = async () => {
    console.log(PlanData);
    try {
      await axios
        .get(`/tour/diary/${PlanData.diaryId}`, {
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

  useEffect(() => {
    getData();
  }, []);

  const naviBack = () => {
    console.log(PlanData.imageUrl);
    console.log(PlanData);
    console.log(planName);
    console.log(Diarydata);
    window.history.back();
  };

  const navimakediary = () => {
    console.log(PlanData);
    navigate('/makediary', { state: { PlanData: PlanData } });
  };

  return (
    <div className="flex w-full h-[864px]">
      <div className="w-1/2 h-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <i className="backArrow ml-2 cursor-pointer" onClick={naviBack}></i>
            <div className="font-['BMJUA'] text-3xl text-black ml-2 flex items-center">
              {planName}
            </div>
            <div className="font-['BMJUA'] text-xl text-[#ED661A] ml-5 flex items-center">
              {PlanData.time}
            </div>
          </div>
          <button
            onClick={navimakediary}
            className="flex items-center justify-center w-20 h-7 mx-10 bg-black rounded-2xl text-white font-['Nanum Gothic'] text-sm font-semibold"
          >
            일기 작성
          </button>
        </div>
        <div className="w-full h-[800px] flex justify-center">
          <div className="w-5/6 h-full mb-5">
            <div className="w-full h-full flex flex-col pt-3">
              <div className="w-full h-[95%] flex flex-col py-5 rounded-md shadow-xl">
                <div className="flex justify-between h-[10%] mx-5 items-center">
                  <div className="flex w-[50%] items-center">
                    <div className="font-['BMJUA'] text-[#FF9A9A] text-xl mr-5"></div>
                    <div className="font-['BMJUA'] text-2xl">
                      {PlanData.locationName}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center h-fit m-5">
                  <img
                    src={PlanData.imageUrl}
                    width="250px"
                    alt="지역소개사진"
                    className="w-full h-full"
                  />
                </div>
                <div className="mx-10 my-5 h-full">
                  <div className="flex justify-between">
                    <div className="font-['Nanum Gothic'] font-bold text-lg">
                      {PlanData.title}
                    </div>
                    <div>날씨</div>
                  </div>
                  <div className="font-['Nanum Gothic'] mt-3">
                    {PlanData.content}
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

export default MyDiaryDetail;
