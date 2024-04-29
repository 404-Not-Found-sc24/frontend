import React, {useState} from 'react';
import Map from "../components/Map";

const DiaryDetail: React.FC = () => {
    const [activeTab, setActiveTab] = useState('1');

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const naviBack = () => {
        window.history.back();
    };

    return (
        <div className="flex w-full h-[864px]">
            <div className="w-1/2 h-full">
                <div className="flex">
                    <i className="backArrow ml-2 cursor-pointer" onClick={naviBack}></i>
                    <div className="flex items-center">
                        <div className="font-['BMJUA'] text-3xl text-black ml-2 flex items-center">여행 이름</div>
                        <div className="font-['BMJUA'] text-xl text-[#ED661A] ml-5 flex items-center">여행 날짜</div>
                    </div>
                </div>
                <div className="w-full h-[800px] flex justify-center">
                    <div className="w-5/6 h-full mb-5">
                        <div className="w-full h-full flex flex-col pt-3">
                            <div className="w-full h-[95%] flex flex-col py-5 rounded-md shadow-xl">
                                <div className="flex justify-between h-[10%] mx-5 items-center">
                                    <div className="flex w-[50%] items-center">
                                        <div className="font-['BMJUA'] text-[#FF9A9A] text-xl mr-5">11:00</div>
                                        <div className="font-['BMJUA'] text-2xl">장소 이름</div>
                                    </div>
                                    <button
                                        className="w-20 h-7 bg-black rounded-2xl text-white font-['Nanum Gothic'] text-sm font-semibold">가져오기
                                    </button>
                                </div>
                                <div className="flex justify-center h-fit m-5">
                                    <img src="" width="400px" height="300px" alt="지역소개사진"></img>
                                </div>
                                <div className="mx-10 my-5 h-full">
                                    <div className="flex justify-between">
                                        <div className="font-['Nanum Gothic'] font-bold text-lg">일기 제목</div>
                                        <div>날씨</div>
                                    </div>
                                    <div className="font-['Nanum Gothic'] mt-3">일기 내용</div>
                                </div>

                                {/* 세부 사항 넣기 */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Map/>
        </div>
    );
};

export default DiaryDetail;