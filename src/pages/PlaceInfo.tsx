import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PlaceDetail from '../../types/PlaceDetail';
import SearchBar from '../components/SearchBar';
import Map from '../components/Map';
import PlanBox from '../components/PlanBox';
import { MapProvider } from '../context/MapContext';
import '../index.css';
import axios from 'axios';
import SearchResultDiary from '../components/SearchResultDiary';

const PlaceInfo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('장소 소개');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const location = useLocation(); // 현재 URL 정보 가져오기
  const [res, setRes] = useState<PlaceDetail | undefined>();
  const place = location.state.place;

  console.log(place);

  useEffect(() => {
    getData();
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const naviBack = () => {
    window.history.back();
    window.history.back();
  };

  const getData = async () => {
    try {
      await axios
        .get(`https://api.nadueli.com/tour/location/${place.locationId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log(response.data);
          setRes(response.data);
        });
    } catch (e) {
      console.error('Error:', e);
    }
  };

  console.log(res);
  return (
    <div className="flex w-full h-[864px]">
      <div className="w-1/2 h-full">
        <i
          className="absolute backArrow ml-2 cursor-pointer"
          onClick={naviBack}
        ></i>
        <div className="w-full flex justify-center mt-5">
          <div className="w-5/6">
            <SearchBar />
          </div>
        </div>
        <div className="flex max-w-2xl mx-auto pt-4">
          <div
            id="1"
            className={`mx-auto justify-center py-2 text-center w-1/2 border-main-red-color font-BMJUA text-2xl cursor-pointer ${
              activeTab === '장소 소개'
                ? 'border-x-2 border-t-2 rounded-t-lg text-main-red-color'
                : 'border-b-2'
            }`}
            onClick={() => handleTabClick('장소 소개')}
          >
            장소 소개
          </div>
          <div
            id="2"
            className={`mx-auto justify-center py-2 text-center w-1/2 border-main-red-color font-BMJUA text-2xl cursor-pointer ${
              activeTab === '일기 보기'
                ? 'border-x-2 border-t-2 rounded-t-lg text-main-red-color'
                : 'border-b-2'
            }`}
            onClick={() => handleTabClick('일기 보기')}
          >
            일기 보기
          </div>
          <div
            id="3"
            className={`mx-auto justify-center py-2 text-center w-1/2 border-main-red-color font-BMJUA text-2xl cursor-pointer ${
              activeTab === '일정 보기'
                ? 'border-x-2 border-t-2 rounded-t-lg text-main-red-color'
                : 'border-b-2'
            }`}
            onClick={() => handleTabClick('일정 보기')}
          >
            일정 보기
          </div>
        </div>
        <div className="w-full h-[685px] flex justify-center">
          <div className="w-[672px] h-full mb-5">
            {activeTab === '장소 소개' && (
              <div className="w-full h-full flex flex-col items-center pt-3">
                <div className="w-full h-[95%] flex justify-center py-5 rounded-md shadow-xl">
                  <div className="w-full h-full flex items-center flex-col">
                    <div className="m-3">
                      <div className="text-center font-NanumGothic font-semibold text-2xl mb-5">
                        [{place.name}]
                      </div>
                      {place.imageUrl ? (
                        <img
                          src={place.imageUrl}
                          alt={place.name}
                          className="rounded-4 w-[400px] h-[250px] object-cover"
                        />
                      ) : (
                        <div className="border-2 flex w-[400px] h-[250px] mt-2 text-gray-600 justify-center items-center">
                          사진이 없습니다.
                        </div>
                      )}
                    </div>
                    <div className="m-5 w-4/5">
                      <table>
                        <thead>
                          <tr>
                            <th>주소</th>
                            <th>분류</th>
                            <th>전화번호</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{res ? res.address : ''}</td>
                            <td>{res ? res.division : ''}</td>
                            <td>
                              {res
                                ? res.phone === 'nan'
                                  ? '-'
                                  : res.phone
                                : '-'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      {res && res.division === '음식점' && (
                        <table>
                          <thead>
                            <tr>
                              <th>쉬는날</th>
                              <th>대표메뉴</th>
                              <th>메뉴</th>
                              <th>포장가능</th>
                              <th>주차시설</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                {res
                                  ? res.restaurant.dayOff === 'nan'
                                    ? '-'
                                    : res.restaurant.dayOff
                                  : '-'}
                              </td>
                              <td>{res ? res.restaurant.mainMenu : '-'}</td>
                              <td>{res ? res.restaurant.menu : '-'}</td>
                              <td>
                                {res
                                  ? res.restaurant.packaging === 'nan'
                                    ? '-'
                                    : res.restaurant.packaging
                                  : '-'}
                              </td>
                              <td>
                                {res ? res.restaurant.parking || '-' : '-'}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                      {res && res.division === '문화시설' && (
                        <table>
                          <thead>
                            <tr>
                              <th>이용시간</th>
                              <th>쉬는날</th>
                              <th>이용요금</th>
                              <th>할인정보</th>
                              <th>주차시설</th>
                              <th>유모차대여</th>
                              <th>애완동물</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                {res &&
                                res.culture &&
                                res.culture.time &&
                                typeof res.culture.time === 'string'
                                  ? res.culture.time.length > 35
                                    ? `${res.culture.time.slice(0, 35)}...`
                                    : res.culture.time
                                  : '-'}
                              </td>
                              <td>{res ? res.culture.offDate : '-'}</td>
                              <td>
                                {res &&
                                res.culture &&
                                res.culture.fee &&
                                typeof res.culture.fee === 'string'
                                  ? res.culture.fee.replace(/<br >/g, ' ')
                                      .length > 35
                                    ? `${res.culture.fee
                                        .replace(/<br >/g, ' ')
                                        .slice(0, 35)}...`
                                    : res.culture.fee.replace(/<br >/g, ' ')
                                  : '-'}
                              </td>
                              <td>
                                {res
                                  ? res.culture.discount === 'nan'
                                    ? '-'
                                    : res.culture.discount
                                  : '-'}
                              </td>
                              <td>{res ? res.culture.parking || '-' : '-'}</td>
                              <td>{res ? res.culture.babycar || '-' : '-'}</td>
                              <td>{res ? res.culture.pet || '-' : '-'}</td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                      {res && res.division === '축제 공연 행사' && (
                        <table>
                          <thead>
                            <tr>
                              <th>행사시작일</th>
                              <th>행사종료일</th>
                              <th>공연시간</th>
                              <th>이용요금</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{res ? res.festival.startDate : '-'}</td>
                              <td>{res ? res.festival.endDate : '-'}</td>
                              <td>{res ? res.festival.time : '-'}</td>
                              <td>{res ? res.festival.fee : '-'}</td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                      {res && res.division === '관광지' && (
                        <table>
                          <thead>
                            <tr>
                              <th>쉬는날</th>
                              <th>이용시간</th>
                              <th>주차시설</th>
                              <th>유모차대여</th>
                              <th>애완동물</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{res ? res.tour.offDate : '-'}</td>
                              <td>{res ? res.tour.time : '-'}</td>
                              <td>{res ? res.tour.parking : '-'}</td>
                              <td>
                                {res
                                  ? res.tour &&
                                    (res.tour.babycar === 'nan' ||
                                      !res.tour.babycar)
                                    ? '-'
                                    : res.tour.babycar
                                  : '-'}
                              </td>
                              <td>
                                {res
                                  ? res.tour &&
                                    (res.tour.pet === 'nan' || !res.tour.pet)
                                    ? '-'
                                    : res.tour.pet
                                  : '-'}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                      {res && res.division === '레포츠' && (
                        <table>
                          <thead>
                            <tr>
                              <th>쉬는날</th>
                              <th>개장기간</th>
                              <th>이용시간</th>
                              <th>입장료</th>
                              <th>주차시설</th>
                              <th>유모차대여</th>
                              <th>애완동물</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{res ? res.leisure.offDate : '-'}</td>
                              <td>
                                {res &&
                                res.leisure &&
                                res.leisure.openDate &&
                                typeof res.leisure.openDate === 'string'
                                  ? res.leisure.openDate.replace(/<br>/g, ' ')
                                      .length > 35
                                    ? `${res.leisure.openDate
                                        .replace(/<br>/g, ' ')
                                        .slice(0, 35)}...`
                                    : res.leisure.openDate.replace(/<br>/g, ' ')
                                  : '-'}
                              </td>
                              <td>{res ? res.leisure.time : '-'}</td>
                              <td>
                                {res
                                  ? res.leisure.fee === 'nan'
                                    ? '-'
                                    : res.leisure.fee
                                  : '-'}
                              </td>
                              <td>
                                {res &&
                                res.leisure &&
                                res.leisure.parking &&
                                typeof res.leisure.parking === 'string'
                                  ? res.leisure.parking.replace(/<br>/g, ' ')
                                      .length > 35
                                    ? `${res.leisure.parking
                                        .replace(/<br>/g, ' ')
                                        .slice(0, 35)}...`
                                    : res.leisure.parking.replace(/<br>/g, ' ')
                                  : '-'}
                              </td>
                              <td>{res ? res.leisure.babycar : '-'}</td>
                              <td>{res ? res.leisure.pet : '-'}</td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                      {res && res.division === '숙박' && (
                        <table>
                          <thead>
                            <tr>
                              <th>체크인</th>
                              <th>체크아웃</th>
                              <th>주차시설</th>
                              <th>조리시설</th>
                              <th>홈페이지</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{res ? res.accommodation.checkIn : '-'}</td>
                              <td>{res ? res.accommodation.checkOut : '-'}</td>
                              <td>{res ? res.accommodation.parking : '-'}</td>
                              <td>{res ? res.accommodation.cook : '-'}</td>
                              <td>
                                {res ? res.accommodation.reservation : '-'}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                      {res && res.division === '쇼핑' && (
                        <table>
                          <thead>
                            <tr>
                              <th>영업시간</th>
                              <th>쉬는날</th>
                              <th>주차시설</th>
                              <th>유모차 대여</th>
                              <th>애완동물 동반</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{res ? res.shopping.time : '-'}</td>
                              <td>{res ? res.shopping.offDate : '-'}</td>
                              <td>{res ? res.shopping.parking : '-'}</td>
                              <td>{res ? res.shopping.babycar : '-'}</td>
                              <td>{res ? res.shopping.pet : '-'}</td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === '일기 보기' && (
              <div className="w-full h-full flex flex-col items-center pt-3">
                <SearchResultDiary />
              </div>
            )}
            {activeTab === '일정 보기' && (
              <div className="w-full h-full flex flex-col items-center pt-3">
                <PlanBox />
              </div>
            )}
          </div>
        </div>
      </div>
      <MapProvider
        initialCenter={{ latitude: place.latitude, longitude: place.longitude }}
      >
        <Map />
      </MapProvider>
    </div>
  );
};

export default PlaceInfo;
