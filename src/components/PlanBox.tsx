import '../index.css';
import React from "react";
import {useNavigate} from "react-router-dom";

interface PlanBoxProps {
}

const PlanBox: React.FC<PlanBoxProps> = () => {
    const navigate = useNavigate();

    const toPlanDetail = () => {
        navigate('/plandetail');
    };

    return (
        <div className="w-full h-[30%] p-5 flex rounded-md shadow-xl mb-5" onClick={toPlanDetail}>
            <div className="flex items-center">
                <img src="" width="250px" alt="지역소개사진"></img>
            </div>
            <div className="flex flex-col ml-5 mt-2">
                <div className="font-['BMJUA'] text-2xl">일정 이름</div>
                <div className="font-['BMJUA'] text-[#ED661A] text-lg">일정 날짜</div>
                <div className="font-['Nanum Gothic'] text-[#6E6E6E] text-sm mt-2">작성자</div>
            </div>
        </div>
    );
};

export default PlanBox;