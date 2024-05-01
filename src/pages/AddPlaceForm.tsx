import React, { useState } from 'react';
import axios from 'axios';
import Map from '../components/Map';
import { MapProvider, useMap } from '../context/MapContext';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';

const AddPlaceForm: React.FC = () => {
  const [placeInfo, setPlaceInfo] = useState({
    name: '',
    address: '',
    detail: '',
    division: '',
    phone: '',
    content: '',
    latitude: 37.2795,
    longitude: 127.0438,
    images: [] as File[],
  });
  const [selectedLocationMessage, setSelectedLocationMessage] = useState('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const { setMapLocation } = useMap();
  const { accessToken } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPlaceInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleMapClick = (lat: number, lng: number) => {
    setPlaceInfo((prevState) => ({
      ...prevState,
      latitude: lat,
      longitude: lng,
    }));
    setSelectedLocationMessage(
      `선택된 장소의 위도는: ${lat}, 경도는: ${lng} 입니다.`,
    );
    setMapLocation(lat, lng);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setPlaceInfo((prevState) => ({
        ...prevState,
        images: Array.from(files),
      }));

      const imagePreviews = Array.from(files).map((file) =>
        URL.createObjectURL(file),
      );
      setPreviewImages(imagePreviews);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', placeInfo.name);
      formData.append('address', placeInfo.address);
      formData.append('detail', placeInfo.detail);
      formData.append('division', placeInfo.division);
      formData.append('phone', placeInfo.phone);
      formData.append('content', placeInfo.content);
      formData.append('latitude', String(placeInfo.latitude));
      formData.append('longitude', String(placeInfo.longitude));
      placeInfo.images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await axios.post('/tour/new-location', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('장소 정보 제출됨:', response.data);
      toast.success('장소 정보 제출에 성공했습니다.', {
        position: 'top-center',
      });
      // 성공적으로 제출되었을 경우 처리
    } catch (error) {
      console.error('장소 정보 제출 실패:', error);
      toast.error('장소 정보 제출에 실패했습니다.', {
        position: 'top-center',
      });
    }
  };

  const handleBackButtonClick = () => {
    window.history.back();
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? previewImages.length - 1 : prevIndex - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === previewImages.length - 1 ? 0 : prevIndex + 1,
    );
  };

  return (
    <div className="w-full h-screen flex">
      <ToastContainer />
      <div className="flex flex-col w-1/2 p-6">
        <div className="flex items-center">
          <button
            className="backArrow"
            onClick={handleBackButtonClick}
          ></button>
          <div className="text-2xl px-2 font-[BMJUA]">나만의 장소 추가하기</div>
        </div>
        <div className="p-10 flex flex-col items-center">
          <div className="relative py-2 flex flex-col w-full border">
            <button
              onClick={handlePrevImage}
              className="backArrow absolute top-20  rounded-full flex justify-center"
            ></button>
            <div className="mx-auto">
              {previewImages.length === 0 && (
                <div className="flex justify-center items-center w-56 h-56 border border-gray-300 rounded-md">
                  <div className="text-gray-500">사진을 업로드 해주세요</div>
                </div>
              )}
              {previewImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Preview ${index}`}
                  className={`w-56 h-56 object-cover mr-2 mb-2 ${
                    index === currentImageIndex ? '' : 'hidden'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNextImage}
              className="backArrow rotate-180 absolute right-0 top-20  rounded-full flex justify-center"
            ></button>
          </div>
          <div className="flex flex-col my-2 w-full p-10 shadow-xl border font-BMJUA">
            <div className="flex p-1 items-center">
              <div className="flex w-20">장소명 :</div>
              <input
                type="text"
                placeholder="장소명"
                name="name"
                value={placeInfo.name}
                onChange={handleChange}
                className="w-full p-2 border-2 input-field"
              />
            </div>
            <div className="flex p-1 items-center">
              <div className="flex w-20">주소 :</div>
              <input
                type="text"
                placeholder="주소"
                name="address"
                value={placeInfo.address}
                onChange={handleChange}
                className="w-full p-2 border-2 input-field"
              />
            </div>
            <div className="flex p-1 items-center">
              <div className="flex w-20">상세 설명 :</div>
              <textarea
                placeholder="상세 설명"
                name="detail"
                value={placeInfo.detail}
                onChange={handleChange}
                className="w-full p-2 border-2 input-field "
                rows={3}
              />
            </div>
            <div className="flex p-1 items-center">
              <div className="flex w-20">구분 :</div>
              <input
                type="text"
                placeholder="구분"
                name="division"
                value={placeInfo.division}
                onChange={handleChange}
                className="w-full p-2 border-2 input-field "
              />
            </div>
            <div className="flex p-1 items-center">
              <div className="flex w-20">전화번호 :</div>
              <input
                type="text"
                placeholder="전화번호"
                name="phone"
                value={placeInfo.phone}
                onChange={handleChange}
                className="w-full p-2 border-2 input-field "
              />
            </div>
            <div className="flex p-1 items-center">
              <div className="flex w-20">내용 :</div>
              <textarea
                placeholder="내용"
                name="content"
                value={placeInfo.content}
                onChange={handleChange}
                className="w-full p-2 border-2 input-field "
                rows={3}
              />
            </div>
            <div className="flex p-1 items-center">
              <div className="flex w-20"> 위도 :</div>
              <div className="mx-2">{placeInfo.latitude}</div>
            </div>
            <div className="flex p-1 items-center">
              <div className="flex w-20">경도 :</div>
              <div className="mx-2">{placeInfo.longitude}</div>
            </div>
            <div className="mb-4">{selectedLocationMessage}</div>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="mb-2 p-2 border-2 border-main-red-color"
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="py-2 bg-main-red-color text-white rounded-md"
        >
          장소 추가
        </button>
      </div>
      <MapProvider
        initialCenter={{
          latitude: placeInfo.latitude,
          longitude: placeInfo.longitude,
        }}
      >
        <Map onMapClick={handleMapClick} />
      </MapProvider>
    </div>
  );
};

export default AddPlaceForm;
