import '../index.css';
import React from "react";
import {useNavigate} from "react-router-dom";

interface PlanDetailBoxProps {
}

const PlanDetailBox: React.FC<PlanDetailBoxProps> = () => {

    return (
        <div className="w-full h-[15%] p-5 flex rounded-md shadow-xl mb-5">
            <div className="w-full flex items-center px-5">
                <div className="w-[10%] font-['BMJUA'] text-[#FF9A9A] text-xl">11:00</div>
                <div className="w-[22%] font-['BMJUA'] text-2xl">장소 이름</div>
                <div className="w-[43%] font-['Nanum Gothic']">일기</div>
                <div className="w-[25%]">
                    <img src="" width="250px" alt="지역소개사진" className="border-2 border-black"></img>
                </div>
            </div>
        </div>
    );
};

export default PlanDetailBox;