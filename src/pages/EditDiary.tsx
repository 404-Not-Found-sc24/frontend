import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import Map from '../components/Map';
import '../index.css';
import { ToastContainer, toast } from 'react-toastify';
import { MapProvider } from '../context/MapContext';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const EditDiary: React.FC = () => {
  const location = useLocation();
  const PlanData = location.state.PlanData;
  const Diarydata = location.state.Diarydata;
  const [title, setTitle] = useState(PlanData.title);
  const [content, setContent] = useState(PlanData.content);
  const [weather, setWeather] = useState(Diarydata.weather);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>(
    Diarydata.imageUrl ? [Diarydata.imageUrl] : [],
  );
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [showUploadMessage, setShowUploadMessage] = useState<boolean>(
    !Diarydata.imageUrl || Diarydata.imageUrl.length === 0,
  );
  const { accessToken, refreshAccessToken } = useAuth();
  const navigate = useNavigate();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const initialMarkers = PlanData
    ? [
        {
          placeId: PlanData.placeId,
          latitude: PlanData.latitude,
          longitude: PlanData.longitude,
        },
      ]
    : [];

  const initialCenter = PlanData
    ? { latitude: PlanData.latitude, longitude: PlanData.longitude }
    : { latitude: 37.2795, longitude: 127.0438 };

  const notifySuccess = () =>
    toast.success('일기가 성공적으로 수정되었습니다.', {
      position: 'top-center',
    });
  const notifyError = () =>
    toast.error('일기 수정 중 오류가 발생했습니다.', {
      position: 'top-center',
    });

  const handleSubmit = async () => {
    console.log(title);
    console.log(content);
    console.log(weather);
    console.log(images);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('weather', weather);
      images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await axios.patch(
        `schedule/diary/${PlanData.diaryId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('일기가 성공적으로 수정되었습니다:', response.data);
      notifySuccess();
      const id = setTimeout(() => {
        navigate('/mypage');
      }, 3000);
      setTimeoutId(id);
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
        console.error('일기 수정 중 오류 발생:', error);
        notifyError();
      }
    }
  };

  const handleImageRemove = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);

    const updatedPreviews = [...previewImages];
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);

    if (updatedPreviews.length === 0) {
      setShowUploadMessage(true);
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

  const handleTitleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      console.log(event.target.value);
      setTitle(event.target.value);
    },
    [],
  );

  const handleContentChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      console.log(event.target.value);
      setContent(event.target.value);
    },
    [],
  );

  const handleBackButtonClick = () => {
    window.history.back();
  };

  return (
    <div className="w-full h-[90%] flex">
      <div className="w-1/2 h-full flex-col">
        <ToastContainer />
        <div className="h-[8%] flex flex-row">
          <div
            className="backArrow cursor-pointer w-[10%] h-full"
            onClick={handleBackButtonClick}
            role="button"
            tabIndex={0}
          ></div>
          <div className="font-['Nanum Gothic'] font-bold text-xl flex w-[90%] h-full items-center">
            {PlanData.locationName}
          </div>
        </div>
        <div className="px-5 pb-5 flex flex-col items-center h-[92%]">
          <div className="flex w-full border h-[30%] justify-center items-center">
            <div className="relative w-[70%] h-[90%] flex justify-center items-center border border-gray-300 rounded-md">
              {showUploadMessage ? (
                <div className="text-gray-500">사진을 업로드 해주세요</div>
              ) : (
                <div className="relative w-full h-full flex justify-center items-center">
                  <img
                    src={previewImages[currentImageIndex] || 'placeholder.png'}
                    alt={`Image preview ${currentImageIndex}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="w-full my-2 shadow-xl border p-5 h-[50%]">
            <div className="flex flex-row xl:flex w-full font-BMJUA h-[20%] justify-between">
              <div className="flex items-center h-full">
                일기 제목 :
                <input
                  type="text"
                  placeholder="일기 제목"
                  value={title}
                  onChange={handleTitleChange}
                  className="2xl:w-72 w-36  p-2 mx-2 my-2 border-2 border-main-red-color rounded-md"
                />
              </div>
              <div className="flex items-center h-full">
                날씨 :
                <select
                  onChange={(e) => setWeather(e.target.value)}
                  value={weather}
                  className="2xl:w-32 w-20  p-2 mx-2 my-2 border-2 border-main-red-color rounded-md"
                >
                  <option value="맑음">맑음</option>
                  <option value="구름">구름</option>
                  <option value="비">비</option>
                  <option value="눈">눈</option>
                  <option value="바람">바람</option>
                </select>
              </div>
            </div>
            <div className="mt-2 font-BMJUA h-[80%] w-full">
              일기 내용 :
              <textarea
                placeholder="일기 내용"
                value={content}
                onChange={handleContentChange}
                className="w-full p-2 my-2  border-2 border-main-red-color rounded-md h-[80%]"
                rows={5}
              />
            </div>
          </div>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full p-2 my-2  border-2 border-main-red-color rounded-md h-[10%]"
          />
          <div className="mt-4 flex justify-end w-full w-[10%]">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-main-red-color text-white rounded-md"
            >
              일기 수정
            </button>
          </div>
        </div>
      </div>
      <MapProvider
        initialMarkers={initialMarkers}
        initialCenter={initialCenter}
      >
        <Map />
      </MapProvider>
    </div>
  );
};

export default EditDiary;