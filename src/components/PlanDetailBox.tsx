import '../index.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

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

interface PlanDetailBoxProps {
  scheduleData: ScheduleData | undefined;
}

const PlanDetailBox: React.FC<PlanDetailBoxProps> = ({ scheduleData }) => {
  if (!scheduleData) {
    return null;
  }
  const navigate = useNavigate();

  const toDiaryDetail = () => {
    navigate('/diarydetail');
  };

  const { time, locationName, content, images } = scheduleData;

  return (
    <div
      className="w-full h-[15%] p-5 flex rounded-md shadow-xl mb-5"
      onClick={toDiaryDetail}
    >
      <div className="w-full flex items-center px-5">
        <div className="w-[10%] font-['BMJUA'] text-[#FF9A9A] text-xl">
          {time}
        </div>
        <div className="w-[22%] font-['BMJUA'] text-2xl">{locationName}</div>
        <div className="w-[43%] font-['Nanum Gothic']">{content}</div>
        <div className="w-[25%]">
          {images &&
            images.map((image: { imageUrl: string }, index: number) => (
              <img
                key={index}
                src={image.imageUrl}
                width="250px"
                alt="지역소개사진"
                className="border-2 border-black"
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default PlanDetailBox;
