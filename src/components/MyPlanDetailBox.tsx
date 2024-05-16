import '../index.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

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

interface PlanDetailBoxProps {
  scheduleData: PlanData;
  planName: string;
}

const MyPlanDetailBox: React.FC<PlanDetailBoxProps> = ({
  scheduleData,
  planName,
}) => {
  const navigate = useNavigate();

  const toDiaryDetail = () => {
    console.log(scheduleData);
    navigate('/mydiarydetail', {
      state: { PlanData: scheduleData, planName: planName },
    });
  };

  const { time, locationName, content, imageUrl } = scheduleData;

  return (
    <div
      className="w-full h-[15%] p-5 flex rounded-md shadow-xl mb-5"
      onClick={toDiaryDetail}
    >
      <div className="w-full flex items-center px-5">
        <div className="w-[10%] font-['BMJUA'] text-[#FF9A9A] text-xl">
          {time}
        </div>
        <div className="w-[22%] font-['BMJUA'] text-2xl">{locationName.length > 7 ? `${locationName.slice(0, 7)}...` : locationName}</div>
        <div className="w-[43%] font-['Nanum Gothic']">{content}</div>
        <div className="w-[25%]">
          <img
            src={imageUrl}
            width="250px"
            alt="지역소개사진"
            className="border-2 border-black"
          />
        </div>
      </div>
    </div>
  );
};

export default MyPlanDetailBox;
