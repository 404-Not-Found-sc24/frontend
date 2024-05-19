import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import PlaceData from '../../types/PlaceData';

interface PlanData {
  scheduleId: string;
  name: string;
  startDate: string;
  endDate: string;
  userName: string;
  imageUrl: string;
}

interface Props {
  tab: string;
  onResultsUpdate: (newPlaces: PlaceData[]) => void;
}

const SearchResults: React.FC<Props> = ({ tab, onResultsUpdate }) => {
  const [placeSearchResults, setPlaceSearchResults] = useState<PlaceData[]>([]);
  const [planSearchResults, setPlanSearchResults] = useState<PlanData[]>([]);
  const [lastPlaceIdx, setLastPlaceIdx] = useState<number>(0);
  const placeLoadMoreRef = useRef<HTMLDivElement>(null);
  const planLoadMoreRef = useRef<HTMLDivElement>(null);
  const placeObserver = useRef<IntersectionObserver>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('q') || '';
  const city = queryParams.get('city') || '';

  useEffect(() => {
    const fetchPlaceDataOnScroll = async () => {
      try {
        const placeResponse = await axios.get(
          `/tour/locations?city=${city}&keyword=${searchTerm}&lastIdx=${lastPlaceIdx}`,
        );

        const newPlaceResults = [...placeSearchResults, ...placeResponse.data];
        setPlaceSearchResults(newPlaceResults);
        setLastPlaceIdx(
          (prevLastIdx) => prevLastIdx + placeResponse.data.length,
        );
        onResultsUpdate(newPlaceResults); // Update the parent component with new results
      } catch (error) {
        console.error('Failed to fetch place search results:', error);
      }
    };

    const placeOptions = {
      root: null,
      rootMargin: '20px',
      threshold: 0.8,
    };

    const placeCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fetchPlaceDataOnScroll();
        }
      });
    };

    placeObserver.current = new IntersectionObserver(
      placeCallback,
      placeOptions,
    );

    if (placeLoadMoreRef.current) {
      placeObserver.current.observe(placeLoadMoreRef.current);
    }

    return () => {
      if (placeObserver.current) {
        placeObserver.current.disconnect();
      }
    };
  }, [placeLoadMoreRef, location.search, lastPlaceIdx]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (tab === '일정 보기') {
          const planResponse = await axios.get(
            `/tour/schedules?city=${city}&keyword=${searchTerm}`,
          );
          setPlanSearchResults(planResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch plan search results:', error);
      }
    };

    fetchData();
  }, [location.search, tab, city, searchTerm]);

  useEffect(() => {
    setPlaceSearchResults([]);
    setPlanSearchResults([]);
    setLastPlaceIdx(0);
  }, [location.search]);

  return (
    <div className="bg-white p-10 max-h-[660px] overflow-y-auto">
      {tab === '장소 보기' &&
        placeSearchResults.map((place: PlaceData, index) => (
          <Link
            key={index}
            to={{
              pathname: '/placeinfo',
            }}
            state={{ place }}
            className="w-full h-[30%] p-5 flex rounded-md shadow-xl mb-2"
          >
            <div>
              <div className="flex">
                {place.imageUrl ? (
                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    className="w-32 h-32 mt-2"
                  />
                ) : (
                  <div className="border-2 flex w-32 h-32 mt-2 text-gray-600 justify-center items-center">
                    사진이 없습니다.
                  </div>
                )}

                <div className="flex flex-col p-2">
                  <h3 className="font-[BMJUA] text-xl">{place.name}</h3>
                  <p className="font-[Nanum Gothic] text-gray-600">
                    {place.address}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      {tab === '일정 보기' &&
        planSearchResults.map((plan: PlanData, index) => (
          <Link
            key={index}
            to={{
              pathname: '/scheduleex',
              search: `?scheduleId=${plan.scheduleId}`,
            }}
            state={{ plan }}
            className="w-full h-[30%] p-5 flex rounded-md shadow-xl mb-2"
          >
            <div className="flex">
              {plan.imageUrl && (
                <img
                  src={plan.imageUrl}
                  alt={plan.name}
                  className="w-32 h-32 mt-2"
                />
              )}
              <div className="flex flex-col p-2">
                <h3 className="font-[BMJUA] text-xl">{plan.name}</h3>
                <p className="font-[Nanum Gothic] text-gray-600">
                  {plan.startDate} - {plan.endDate}
                </p>
              </div>
            </div>
          </Link>
        ))}
      {tab === '장소 보기' && <div ref={placeLoadMoreRef}></div>}
      {tab === '일정 보기' && <div ref={planLoadMoreRef}></div>}
    </div>
  );
};

export default SearchResults;
