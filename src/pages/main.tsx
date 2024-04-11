import React from 'react';

const Main: React.FC = () => {
  return (
    <div>
      <form className="flex items-center max-w-2xl mx-auto mt-24">
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none" />
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
      <div className="container flex flex-row justify-between mx-auto mt-auto">
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
