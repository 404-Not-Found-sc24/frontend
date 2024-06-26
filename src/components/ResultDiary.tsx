import React, { useEffect, useState } from 'react';
import DiariesData from '../../types/DiariesData';
import '../index.css';

interface PlanBoxProps {
    props: DiariesData;
    locationId: number;
}

const ResultDiary: React.FC<PlanBoxProps> = (props) => {
    const { diaryId, placeId, title, date, content, imageUrl, userName } = props.props;

    return (
        <div
            className="w-full h-[30%] p-5 flex rounded-md shadow-xl mb-5"
        >
            <div className="flex h-[200px] items-center w-[30%]">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="지역소개사진"
                        style={{ objectFit: 'contain', width: '250px', height: '180px' }}
                    ></img>
                ) : (
                    <div className="border-2 flex w-[250px] h-[180px] mt-2 text-gray-600 justify-center items-center">
                        사진이 없습니다.
                    </div>
                )}
            </div>
            <div className="flex flex-col ml-5 mt-2 max-h-48 w-[65%]">
                <div className="font-['BMJUA'] text-2xl">{title}</div>
                <div className="font-['BMJUA'] text-[#ED661A] text-lg">{date}</div>
                <div className="font-['Nanum Gothic'] text-[#6E6E6E] text-sm mt-2">
                    {userName}
                </div>
                <div className="font-['Nanum Gothic'] text-black text-sm mt-2 overflow-y-auto w-full h-full">
                    {content && content.split('\n').map((line: string, index: number) => (
                        <div key={index}>{line}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResultDiary;
