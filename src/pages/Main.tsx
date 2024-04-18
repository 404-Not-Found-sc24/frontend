import React from 'react';
import SearchBar from '../components/SearchBar';

const Main: React.FC = () => {
  return (
    <div>
      <div className="w-full flex justify-center my-10">
        <div className="w-1/2">
          <SearchBar />
        </div>
      </div>
      <div className="container flex flex-row justify-between mx-auto mt-12">
        <div className="flex flex-col justify-center w-1/2 text-left text-6xl font-['BMHANNAPro']">
          <p className="text-main-red-color ">국내 여행을</p>
          <p>한손에서 간편하게</p>
        </div>
        <div className="w-1/2 h-auto px-4 overflow-hidden shadow-xl md:my-4 lg:my-12 xl:my-4 rounded-2xl">
          <div className="relative flex item-center justify-center w-full h-full">
            <img
              src={`${process.env.PUBLIC_URL}/logo512.png`}
              alt="메인페이지 이미지"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
