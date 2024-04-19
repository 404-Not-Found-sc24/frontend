import React, {useCallback, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import MakeTrip from "./MakeTrip";
import SearchBar from "../components/SearchBar";

const Travledes: React.FC = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [city, setCity] = useState('');

  const handleOpenModal = useCallback(
      (city:string) => {
        setIsOpen(true);
        setCity(city);
      },[]
  );

  const handleCloseModal = useCallback(
      () => {
        setIsOpen(false);
        setCity("");
      },[]
  );

  return (
      <div>
        <div className="w-full flex justify-center my-10">
          <div className="w-1/2">
            <SearchBar/>
          </div>
        </div>
        <div className="container mx-auto mt-24 mb-24 grid grid-cols-2 md:grid-cols-4 gap-8">
          <button className="relative flex flex-col" onClick={() => handleOpenModal("서울")}>
            <img
                src={process.env.PUBLIC_URL + '/image/image 15.png'}
                alt="서울 이미지"
                className="rounded-4"
            />
            <div
                className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
              서울
            </div>
          </button>
          <button className="relative flex flex-col" onClick={() => handleOpenModal("인천")}>
            <img
                src={process.env.PUBLIC_URL + '/image/image 15.png'}
                alt="인천 이미지"
                className="rounded-4"
            />
            <div
                className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
              인천
            </div>
          </button>
          <button className="relative flex flex-col" onClick={() => handleOpenModal("강릉")}>
            <img
                src={process.env.PUBLIC_URL + '/image/image 15.png'}
                alt="강릉 이미지"
                className="rounded-4"
            />
            <div
                className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
              강릉
            </div>
          </button>
          <button className="relative flex flex-col" onClick={() => handleOpenModal("제주")}>
            <img
                src={process.env.PUBLIC_URL + '/image/image 15.png'}
                alt="제주 이미지"
                className="rounded-4"
            />
            <div
                className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
              제주
            </div>
          </button>
          <button className="relative flex flex-col" onClick={() => handleOpenModal("부산")}>
            <img
                src={process.env.PUBLIC_URL + '/image/image 15.png'}
                alt="부산 이미지"
                className="rounded-4"
            />
            <div
                className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
              부산
            </div>
          </button>
          <button className="relative flex flex-col" onClick={() => handleOpenModal("대전")}>
            <img
                src={process.env.PUBLIC_URL + '/image/image 15.png'}
                alt="대전 이미지"
                className="rounded-4"
            />
            <div
                className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
              대전
            </div>
          </button>
          <button className="relative flex flex-col" onClick={() => handleOpenModal("광주")}>
            <img
                src={process.env.PUBLIC_URL + '/image/image 15.png'}
                alt="광주 이미지"
                className="rounded-4"
            />
            <div
                className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
              광주
            </div>
          </button>
          <button className="relative flex flex-col" onClick={() => handleOpenModal("대구")}>
            <img
                src={process.env.PUBLIC_URL + '/image/image 15.png'}
                alt="대구 이미지"
                className="rounded-4"
            />
            <div
                className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
              대구
            </div>
          </button>
        </div>
        <MakeTrip isOpen={isOpen} city={city} handleCloseModal={handleCloseModal}/>
      </div>
  );
};

export default Travledes;
