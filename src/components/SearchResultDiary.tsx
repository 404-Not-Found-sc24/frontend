import React, { useEffect, useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import DiariesData from "../../types/DiariesData";
import '../index.css';

interface PlanBoxProps {
  props: DiariesData
}

const SearchResultDiary: React.FC<PlanBoxProps> = (props) => {
  const { diaryId, placeId, title, date, content, imageUrl } = props.props;
  const navigate = useNavigate();

  const toPlanDetail = () => {
    navigate('/plandetail');
  };

  return (
      <div className="w-full h-[30%] p-5 flex rounded-md shadow-xl mb-5" onClick={toPlanDetail}>
        <div className="flex h-[200px] items-center">
          {imageUrl ? (
              <img src={imageUrl} alt="지역소개사진"
                   style={{objectFit: 'cover', width: '250px', height: '180px'}}></img>
          ) : (
              <div className="border-2 flex w-[250px] h-[180px] mt-2 text-gray-600 justify-center items-center">
                사진이 없습니다.
              </div>
          )}

        </div>
        <div className="flex flex-col ml-5 mt-2">
          <div className="font-['BMJUA'] text-2xl">{title}</div>
          <div className="font-['BMJUA'] text-[#ED661A] text-lg">{date}</div>
          <div className="font-['Nanum Gothic'] text-[#6E6E6E] text-sm mt-2">username</div>
          <div className="font-['Nanum Gothic'] text-black text-sm mt-2">{content}</div>
        </div>
      </div>
  );
};

export default SearchResultDiary;
