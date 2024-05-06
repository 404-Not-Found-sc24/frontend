import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

interface PlaceData {
  locationId: number;
  name: string;
  address: string;
  imageUrl: string;
}

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
}

const SearchResults: React.FC<Props> = ({ tab }) => {
  const [searchResults, setSearchResults] = useState<(PlaceData | PlanData)[]>(
    [],
  );
  const [lastIdx, setLastIdx] = useState<number>(0);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [placeSearchResults, setPlaceSearchResults] = useState<PlaceData[]>([]);
  const [planSearchResults, setPlanSearchResults] = useState<PlanData[]>([]);
  const observer = useRef<IntersectionObserver>();
  const location = useLocation();

  useEffect(() => {
    const fetchDataOnScroll = async () => {
      const queryParams = new URLSearchParams(location.search);
      const searchTerm = queryParams.get('q');
      try {
        // 스크롤 가능한 컨테이너의 끝에 도달했을 때 추가 데이터 요청
        const placeResponse = await axios.get(
          `/tour/locations?keyword=${searchTerm}&lastIdx=${lastIdx}`,
        );
        setPlaceSearchResults((prevData) => [
          ...prevData,
          ...placeResponse.data,
        ]);

        const planResponse = await axios.get(
          `/tour/schedules?city=${searchTerm}&lastIdx=${lastIdx}`,
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
        setPlanSearchResults((prevData) => [...prevData, ...planResponse.data]);
        const newPlaceData = placeResponse.data;
        const newPlanData = planResponse.data;
        if (newPlaceData.length === 0) {
          // 받아온 데이터가 없을 경우 IntersectionObserver를 해제하고 종료
          if (observer.current) {
            observer.current.disconnect();
          }
          return;
        }
        if (newPlanData.length === 0) {
          // 받아온 데이터가 없을 경우 IntersectionObserver를 해제하고 종료
          if (observer.current) {
            observer.current.disconnect();
          }
          return;
        }
        setLastIdx((prevLastIdx) => prevLastIdx + 20);
      } catch (error) {
        console.error('Failed to fetch search results:', error);
      }
    };

    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.8,
    };

    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fetchDataOnScroll();
        }
      });
    };

    observer.current = new IntersectionObserver(callback, options);

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loadMoreRef, location.search, lastIdx]);

  useEffect(() => {
    // 검색어가 변경될 때마다 초기화 및 새로운 데이터 가져오기
    setPlaceSearchResults([]);
    setPlanSearchResults([]);
    setLastIdx(0);
  }, [location.search]);

  useEffect(() => {
    console.log(placeSearchResults);
    console.log(planSearchResults);
    setSearchResults([...placeSearchResults, ...planSearchResults]);
  }, [placeSearchResults, planSearchResults]);

  return (
    <div className="bg-white p-10 max-h-[660px] overflow-y-auto">
      {tab === '장소 보기' &&
        searchResults
          .filter((item): item is PlaceData => 'locationId' in item)
          .map((place: PlaceData, index) => (
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
        searchResults
          .filter((item): item is PlanData => 'scheduleId' in item)
          .map((plan: PlanData, index) => (
            <div key={index} className="bg-gray-100 p-4 mb-4 rounded-lg">
              <div>
                <h3 className="font-bold text-lg">{plan.name}</h3>
                <p className="text-gray-600">
                  {plan.startDate} - {plan.endDate}
                </p>
                {plan.imageUrl && (
                  <img
                    src={plan.imageUrl}
                    alt={plan.name}
                    className="w-32 h-32 mt-2"
                  />
                )}
              </div>
            </div>
          ))}
      <div ref={loadMoreRef}></div>
    </div>
  );
};

export default SearchResults;
