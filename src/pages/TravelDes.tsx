import React from 'react';
import { useNavigate } from 'react-router-dom';
import CitySearchBar from '../components/CitySearchBar';

const Travledes: React.FC = () => {
  const navigate = useNavigate();

  const navigateToSearchTravelmajor = (city: string, city2: string) => {
    navigate('/searchtraveldes', {
      state: {
        city: city,
        city2: city2,
      },
    });
  };

  const navigateToSearchTravel = (city: string) => {
    navigate('/searchtraveldes', {
      state: {
        city: city,
      },
    });
  };

  return (
    <div>
      <div className="w-full flex justify-center my-10">
        <div className="w-1/2">
          <CitySearchBar />
        </div>
      </div>
      <div className="container mx-auto mt-24 mb-24 grid grid-cols-5 md:grid-cols-5 gap-8">
        <button
          className="relative flex flex-col"
          onClick={() => navigateToSearchTravelmajor('광역시', '특별')}
        >
          <img
            src={process.env.PUBLIC_URL + '/image/image 15.png'}
            alt="서울, 광역시 이미지"
            className="rounded-4"
          />
          <div className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
            서울, 광역시
          </div>
        </button>
        <button
          className="relative flex flex-col"
          onClick={() => navigateToSearchTravel('경기도')}
        >
          <img
            src={process.env.PUBLIC_URL + '/image/image 15.png'}
            alt="경기도 이미지"
            className="rounded-4"
          />
          <div className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
            경기도
          </div>
        </button>
        <button
          className="relative flex flex-col"
          onClick={() => navigateToSearchTravel('강원도')}
        >
          <img
            src={process.env.PUBLIC_URL + '/image/image 15.png'}
            alt="강원도 이미지"
            className="rounded-4"
          />
          <div className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
            강원도
          </div>
        </button>
        <button
          className="relative flex flex-col"
          onClick={() => navigateToSearchTravel('충청북도')}
        >
          <img
            src={process.env.PUBLIC_URL + '/image/image 15.png'}
            alt="충청북도 이미지"
            className="rounded-4"
          />
          <div className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
            충청북도
          </div>
        </button>
        <button
          className="relative flex flex-col"
          onClick={() => navigateToSearchTravel('충청남도')}
        >
          <img
            src={process.env.PUBLIC_URL + '/image/image 15.png'}
            alt="충청남도 이미지"
            className="rounded-4"
          />
          <div className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
            충청남도
          </div>
        </button>
        <button
          className="relative flex flex-col"
          onClick={() => navigateToSearchTravel('경상북도')}
        >
          <img
            src={process.env.PUBLIC_URL + '/image/image 15.png'}
            alt="경상북도 이미지"
            className="rounded-4"
          />
          <div className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
            경상북도
          </div>
        </button>
        <button
          className="relative flex flex-col"
          onClick={() => navigateToSearchTravel('경상남도')}
        >
          <img
            src={process.env.PUBLIC_URL + '/image/image 15.png'}
            alt="경상남도 이미지"
            className="rounded-4"
          />
          <div className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
            경상남도
          </div>
        </button>
        <button
          className="relative flex flex-col"
          onClick={() => navigateToSearchTravel('전라북도')}
        >
          <img
            src={process.env.PUBLIC_URL + '/image/image 15.png'}
            alt="전라북도 이미지"
            className="rounded-4"
          />
          <div className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
            전라북도
          </div>
        </button>
        <button
          className="relative flex flex-col"
          onClick={() => navigateToSearchTravel('전라남도')}
        >
          <img
            src={process.env.PUBLIC_URL + '/image/image 15.png'}
            alt="전라남도 이미지"
            className="rounded-4"
          />
          <div className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
            전라남도
          </div>
        </button>
        <button
          className="relative flex flex-col"
          onClick={() => navigateToSearchTravel('제주')}
        >
          <img
            src={process.env.PUBLIC_URL + '/image/image 15.png'}
            alt="제주 이미지"
            className="rounded-4"
          />
          <div className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
            제주
          </div>
        </button>
      </div>
    </div>
  );
};

export default Travledes;
