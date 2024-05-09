import React, { useCallback, useEffect, useState } from 'react';
import MakeTrip from './MakeTrip';
import CitySearchBar from '../components/CitySearchBar';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface CityData {
  cityName: string;
  imageUrl: string;
}

const SearchTravelDes: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [city, setCity] = useState('');
  const [placeSearchResults, setPlaceSearchResults] = useState<CityData[]>([]);
  const location = useLocation();
  const cityparam = { ...location.state };
  const { accessToken } = useAuth();

  const handleOpenModal = useCallback((city: string) => {
    setIsOpen(true);
    setCity(city);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
    setCity('');
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const queryParams = new URLSearchParams(location.search);
      const searchTerm = queryParams.get('q');

      console.log(searchTerm);
      console.log(cityparam);
      if (searchTerm) {
        try {
          // 장소 데이터 가져오기
          const placeResponse = await axios.get(
            `/tour/city?keyword=${searchTerm}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
          setPlaceSearchResults(placeResponse.data);
        } catch (error) {
          console.error('Failed to fetch search results:', error);
        }
      } else if (cityparam) {
        try {
          // 장소 데이터 가져오기
          const placeResponse = await axios.get(
            '/tour/city?keyword=' +
              cityparam.city +
              '&keyword2=' +
              cityparam.city2,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
          setPlaceSearchResults(placeResponse.data);
        } catch (error) {
          console.error('Failed to fetch search results:', error);
        }
      } else {
        setPlaceSearchResults([]);
      }
    };

    fetchData();
  }, [location.search]);

  return (
    <div>
      <div className="w-full flex justify-center my-10">
        <div className="w-1/2">
          <CitySearchBar />
        </div>
      </div>
      <div className="container mx-auto mt-24 mb-24 grid grid-cols-4 gap-24">
        {placeSearchResults.map((place: CityData, index) => (
          <button
            key={index}
            className="relative flex flex-col w-80 h-80"
            onClick={() => handleOpenModal(place.cityName)}
          >
            <img
              src={place.imageUrl}
              alt={place.cityName + '이미지'}
              className="w-full h-full rounded-4 object-cover"
            />
            <div className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br">
              {place.cityName}
            </div>
          </button>
        ))}
      </div>
      <MakeTrip
        isOpen={isOpen}
        city={city}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
};

export default SearchTravelDes;
