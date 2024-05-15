import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import Map from '../components/Map';
import '../index.css';
import { ToastContainer, toast } from 'react-toastify';
import { MapProvider } from '../context/MapContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const MakeDiary: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [weather, setWeather] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [showUploadMessage, setShowUploadMessage] = useState<boolean>(true);
  const { accessToken, refreshAccessToken } = useAuth();
  const location = useLocation();
  const PlanData = location.state.PlanData;

  const notifySuccess = () =>
    toast.success('일기가 성공적으로 작성되었습니다.', {
      position: 'top-center',
    });
  const notifyError = () =>
    toast.error('일기 작성 중 오류가 발생했습니다.', {
      position: 'top-center',
    });

  const navisuccess = () => {
    window.history.back();
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('weather', weather);
      images.forEach((image) => {
        formData.append('images', image);
      });

      console.log(PlanData);

      const response = await axios.post(
        `schedule/diary/${PlanData.placeID}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('일기가 성공적으로 작성되었습니다:', response.data);
      notifySuccess();
      navisuccess();
    } catch (error) {
      if (
        (error as AxiosError).response &&
        (error as AxiosError).response?.status === 401
      ) {
        try {
          await refreshAccessToken();
          // 새로운 액세스 토큰으로 다시 요청을 보냅니다.
          // 여기에서는 재시도 로직을 추가할 수 있습니다.
        } catch (refreshError) {
          console.error('Failed to refresh access token:', refreshError);
          notifyError();
          // 액세스 토큰 갱신에 실패한 경우 사용자에게 알립니다.
        }
      } else {
        console.error('일기 작성 중 오류 발생:', error);
        notifyError();
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImages = Array.from(e.target.files);
      setImages(selectedImages);

      const imagePreviews = selectedImages.map((image) =>
        URL.createObjectURL(image),
      );
      setPreviewImages(imagePreviews);
      setShowUploadMessage(false);
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
      <div className="w-1/2 flex-col">
        <ToastContainer />
        <div
          className="backArrow cursor-pointer"
          onClick={handleBackButtonClick}
          role="button"
          tabIndex={0}
        ></div>
        <div className="p-10 flex flex-col items-center">
          <div className="relative py-2 flex flex-col w-full border">
            <button
              onClick={handlePrevImage}
              className="backArrow absolute top-1/2  rounded-full flex justify-center items-center"
            ></button>
            <div className="mx-auto">
              {showUploadMessage && (
                <div className="flex justify-center items-center w-96 h-96 border border-gray-300 rounded-md">
                  <div className="text-gray-500">사진을 업로드 해주세요</div>
                </div>
              )}
              {!showUploadMessage && (
                <img
                  src={previewImages[currentImageIndex] || 'placeholder.png'}
                  alt={`Image preview ${currentImageIndex}`}
                  className="w-96 h-96 m-2 object-cover"
                />
              )}
            </div>
            <button
              onClick={handleNextImage}
              className="backArrow rotate-180 absolute right-0 top-1/2  rounded-full flex justify-center items-center"
            ></button>
          </div>
          <div className="w-full my-2 shadow-xl border p-10">
            <div className="flex-row xl:flex w-full font-BMJUA">
              <div className="flex items-center">
                일기 제목 :
                <input
                  type="text"
                  placeholder="일기 제목"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="2xl:w-72 w-36  p-2 mx-2 my-2 border-2 border-main-red-color rounded-md"
                />
              </div>
              <div className="flex items-center ml-auto">
                날씨 :
                <input
                  type="text"
                  placeholder="날씨"
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                  className="2xl:w-32 w-20  p-2 mx-2 my-2 border-2 border-main-red-color rounded-md"
                />
              </div>
            </div>
            <div className="mt-2 font-BMJUA">
              일기 내용 :
              <textarea
                placeholder="일기 내용"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 my-2  border-2 border-main-red-color rounded-md"
                rows={5}
              />
            </div>
          </div>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full p-2 my-2  border-2 border-main-red-color rounded-md"
          />
          <div className="mt-4 flex justify-end w-full">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-main-red-color text-white rounded-md"
            >
              일기 작성
            </button>
          </div>
        </div>
      </div>
      <MapProvider initialCenter={{ latitude: 37.2795, longitude: 127.0438 }}>
        <Map />
      </MapProvider>
    </div>
  );
};

export default MakeDiary;
