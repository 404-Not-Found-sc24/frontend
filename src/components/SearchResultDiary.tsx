import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../index.css';

interface Diary {
  diaryId: number;
  placeId: number;
  scheduleName: string;
  date: string;
  content: string;
  imageUrl: string;
}

const SearchResultDiary: React.FC = () => {
  const location = useLocation();
  const locationId = location.state.place.locationId;
  const placeName = location.state && location.state.placeName;
  const [diaries, setDiaries] = useState([] as Diary[]);

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const response = await axios.get(`/tour/diaries/${locationId}`);
        setDiaries(response.data);
      } catch (error) {
        console.error('Error fetching diaries:', error);
      }
    };

    fetchDiaries();

    return () => {};
  }, [locationId]);

  return (
    <div className="flex w-full h-[864px]">
      <div className="w-full h-full">
        <div className="bg-white p-10 max-h-[660px] overflow-y-auto">
          {diaries.map((diary) => (
            <div
              key={diary.diaryId}
              className="w-full h-[30%] p-5 flex rounded-md shadow-xl mb-2"
            >
              <div className="flex ">
                {diary.imageUrl ? (
                  <img
                    src={diary.imageUrl}
                    alt={diary.scheduleName}
                    className="w-32 h-32 mt-2"
                  />
                ) : (
                  <div className="border-2 flex w-32 h-32 mt-2 text-gray-600 justify-center items-center">
                    사진이 없습니다.
                  </div>
                )}
                <div className="flex flex-col p-2">
                  <div className="font-[BMJUA] text-xl">
                    {diary.scheduleName}
                  </div>
                  <div className="font-[Nanum Gothic] text-gray-600">
                    Date : {diary.date}
                  </div>
                  <div className="font-[Nanum Gothic] text-gray-600">
                    {diary.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResultDiary;
