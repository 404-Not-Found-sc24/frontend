import React, {useCallback, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import MakeTrip from "./MakeTrip";

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
      <form className="flex items-center max-w-2xl mx-auto mt-24">
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
          <input
            type="text"
            id="simple-search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 font-BMJUA"
            placeholder="궁금한 여행지를 검색해보세요!"
            required
          />
        </div>
        <button
          type="submit"
          className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <span className="sr-only">Search</span>
        </button>
      </form>
      <div className="container mx-auto mt-24 mb-24 grid grid-cols-2 md:grid-cols-4 gap-8">
        <button className="relative flex flex-col" onClick={() => handleOpenModal("서울")}>
          <img
            src={process.env.PUBLIC_URL + '/image/image 15.png'}
            alt="서울 이미지"
            className="rounded-4"
          />
          <div className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
            서울
          </div>
        </button>
        <Link to="/" className="relative flex flex-col">
          <img
            src={process.env.PUBLIC_URL + '/image/image 15.png'}
            alt="인천 이미지"
            className="rounded-4"
          />
          <div className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
            인천
          </div>
        </Link>
        <Link to="/" className="relative flex flex-col">
          <img
            src={process.env.PUBLIC_URL + '/image/image 15.png'}
            alt="강릉 이미지"
            className="rounded-4"
          />
          <div className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
            강릉
          </div>
        </Link>
        <Link to="/" className="relative flex flex-col">
          <img
            src={process.env.PUBLIC_URL + '/image/image 15.png'}
            alt="제주 이미지"
            className="rounded-4"
          />
          <div className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
            제주
          </div>
        </Link>
        <Link to="/" className="relative flex flex-col">
          <img
            src={process.env.PUBLIC_URL + '/image/image 15.png'}
            alt="부산 이미지"
            className="rounded-4"
          />
          <div className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
            부산
          </div>
        </Link>
        <Link to="/" className="relative flex flex-col">
          <img
            src={process.env.PUBLIC_URL + '/image/image 15.png'}
            alt="대전 이미지"
            className="rounded-4"
          />
          <div className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
            대전
          </div>
        </Link>
        <Link to="/" className="relative flex flex-col">
          <img
            src={process.env.PUBLIC_URL + '/image/image 15.png'}
            alt="광주 이미지"
            className="rounded-4"
          />
          <div className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
            광주
          </div>
        </Link>
        <Link to="/" className="relative flex flex-col">
          <img
            src={process.env.PUBLIC_URL + '/image/image 15.png'}
            alt="대구 이미지"
            className="rounded-4"
          />
          <div className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
            대구
          </div>
        </Link>
      </div>
      <MakeTrip isOpen={isOpen} city={city} handleCloseModal={handleCloseModal}/>
    </div>
  );
};

export default Travledes;
