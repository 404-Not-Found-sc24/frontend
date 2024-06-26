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
    navigate('/mydiarydetail', {
      state: { PlanData: scheduleData, planName: planName },
    });
  };

  const { time, locationName, title, content, imageUrl } = scheduleData;

  return (
    <div className="w-full h-32 p-5 flex rounded-md shadow-xl mb-5">
      <div className="w-full flex items-center gap-4">
        <img
          src="icon-pencil.png"
          alt="일기 수정"
          className="h-5 w-5 cursor-pointer"
          onClick={toDiaryDetail}
        />
        <div className="w-fit flex flex-col justify-center items-start font-['BMJUA'] text-[#FF9A9A] text-xl">
          {time}
          <span className="font-['BMJUA'] text-black text-md">
            {locationName.length > 6
              ? `${locationName.slice(0, 5)}...`
              : locationName}
          </span>
        </div>
        <div className="w-full h-full flex flex-1 font-['Nanum Gothic'] pr-2 overflow-y-auto flex-col">
          {content && content.split('\n').map((line: string, index: number) => (
            <div key={index}>{line}</div>
          ))}
        </div>
        <div className="w-[25%] flex justify-center">
          {imageUrl ? (
            <img src={imageUrl} className="h-[100px]" alt="일기사진" />
          ) : (
            <div className="w-[100%] h-[100px] flex items-center justify-center">
              <div className="text-center text-main-green-color font-bold font-BMJUA">
                {title || content ? '' : '일기가 없습니다.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPlanDetailBox;
