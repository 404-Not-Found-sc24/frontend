import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import '../index.css';
import { useNavigate } from 'react-router';

const AddEvent: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [showUploadMessage, setShowUploadMessage] = useState<boolean>(true);
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null); // 타이머 ID 상태 추가

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId); // 언마운트 시 타이머 제거
      }
    };
  }, [timeoutId]);

  const handleTitleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
    },
    [],
  );

  const handleContentChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setContent(event.target.value);
    },
    [],
  );

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        setFile(event.target.files[0]);
      }
    },
    [],
  );

  const notifySuccess = () =>
    toast.success('이벤트 정보가 성공적으로 추가되었습니다.', {
      position: 'top-center',
    });
  const notifyError = () =>
    toast.error('이벤트 추가 중 오류가 발생했습니다.', {
      position: 'top-center',
    });

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('eventType', 'EVENT');
      if (file) {
        formData.append('images', file);
      }

      const response = await axios.post('/event', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('이벤트 정보가 성공적으로 추가되었습니다:', response.data);
      notifySuccess();
      const id = setTimeout(() => {
        navigate('/event');
      }, 3000);
      setTimeoutId(id);
    } catch (error) {
      console.error('이벤트 추가 중 오류 발생:', error);
      notifyError();
    }
  };

  return (
    <div className="h-[90%] flex justify-center items-center w-full">
      <ToastContainer />
      <div className="w-[70%] h-[90%] flex justify-center flex-col items-center">
        <div className="font-['Nanum Gothic'] text-3xl font-bold text-main-green-color h-[10%]">
          이벤트 작성
        </div>
        <div className="w-4/5 h-[90%]">
          <div className="flex flex-row items-center h-[20%]">
            <div className="bg-main-green-color w-[0.3rem] h-8 rounded"></div>
            <h1 className="text-xl font-medium mx-3 font-semibold font-['Nanum Gothic']">
              제목
            </h1>
            <input
              type="text"
              value={title}
              placeholder="이벤트 제목"
              className="w-1/2 p-2 mx-2 border-2 border-gray rounded-md font-['Nanum Gothic']"
              onChange={handleTitleChange}
            />
          </div>
          <div className="flex flex-col h-[50%]">
            <div className="flex flex-row items-center mb-1">
              <div className="bg-main-green-color w-[0.3rem] h-8 rounded"></div>
              <h1 className="text-xl font-medium mx-3 font-semibold font-['Nanum Gothic']">
                내용
              </h1>
            </div>
            <textarea
              value={content}
              onChange={handleContentChange}
              className="w-full p-2 border-2 border-gray rounded-md font-['Nanum Gothic']"
              rows={15}
              cols={50}
            ></textarea>
          </div>
          <div className="flex flex-row items-center h-[20%]">
            <div className="bg-main-green-color w-[0.3rem] h-8 rounded"></div>
            <h1 className="text-lg font-medium mx-3 font-semibold font-['Nanum Gothic']">
              첨부파일
            </h1>
            <input
              type="file"
              className="w-1/2 p-2 mx-2 border-2 border-gray rounded-md font-['Nanum Gothic']"
              onChange={handleFileChange}
            />
          </div>
          <div className="w-full flex justify-center h-[10%]">
            <button
              onClick={handleSubmit}
              className="w-fit h-fit px-5 py-3 bg-main-green-color text-white rounded-md font-['Nanum Gothic'] font-bold text-xl"
            >
              추가하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;
