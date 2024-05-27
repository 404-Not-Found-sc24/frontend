import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios, { AxiosError } from 'axios';

interface UserInfo {
    memberId: number;
    name: string;
    nickname: string;
    email: string;
    phone: string;
    role: string;
    imageUrl: string;
}

const MyPageSetting: React.FC = () => {

    const location = useLocation();
    const imageInput = useRef<HTMLInputElement>(null);;
    const data = { ...location.state };
    const [userInfo, setUserInfo] = useState<UserInfo>(data.data);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);

    const { refreshAccessToken } = useAuth();
    const accessToken = localStorage.getItem('accessToken');

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImageFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setUserInfo((prevUserInfo) => ({
                    ...prevUserInfo,
                    imageUrl: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const onClickImageUplaod = () => {
        if (imageInput.current) {
            imageInput.current.click();
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            [name]: value,
        }));
    };

    const handlePopupClose = () => {
        setShowSuccessPopup(false);
    };

    const handleSubmit = async () => {
        console.log(userInfo);
        const formData = new FormData();
        formData.append('name', userInfo.name);
        formData.append('nickname', userInfo.nickname);
        formData.append('phone', userInfo.phone);
        if (imageFile) {
            formData.append('image', imageFile);
        }
        try {
            await axios.patch('/auth', formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setShowSuccessPopup(true);
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
                    // 액세스 토큰 갱신에 실패한 경우 사용자에게 알립니다.
                }
            } else {
                console.error('일정 조회 중 오류 발생:', error);
            }
        }
    };

    return (
        console.log(userInfo),
        <div className="flex justify-center">
            <div className="w-5/6 flex items-center flex-col">
                {userInfo?.imageUrl == null ?
                    <img
                        src={`${process.env.PUBLIC_URL}/image/user.png`}
                        alt="유저 기본 이미지"
                        className="w-24 h-24 -top-10 bg-white rounded-full"
                    />
                    :
                    <img
                        src={userInfo.imageUrl}
                        alt="유저 프로필 이미지"
                        className="w-36 h-36 -top-10 bg-white rounded-full mb-5 border-main-red-color border-2"
                    />
                }
                <div>
                    <button className="bg-main-red-color opacity-75 rounded text-white py-1 px-3" onClick={onClickImageUplaod}>
                        프로필 수정
                    </button>
                    <input
                        type="file"
                        accept="image/jpg, image/png, image/jpeg"
                        className="mt-2 hidden"
                        onChange={handleImageChange}
                        ref={imageInput}
                    />
                </div>
                <div className="mt-4 w-1/2 flex justify-center flex-col">
                    <div className='my-2'>
                        <div className='my-1'>이름</div>
                        <input
                            name="name"
                            value={userInfo.name}
                            onChange={handleInputChange}
                            className="w-full border rounded p-2 mb-2"
                        /></div>
                    <div className='my-2'>
                        <div className='my-1'>닉네임</div>
                        <input
                            name="nickname"
                            value={userInfo.nickname}
                            onChange={handleInputChange}
                            className="w-full border rounded p-2 mb-2"
                        />
                    </div>
                    <div className='my-2'>
                        <div className='my-1'>이메일</div>
                        <input
                            name="email"
                            disabled
                            value={userInfo.email}
                            onChange={handleInputChange}
                            className="w-full border rounded p-2 mb-2 disabled:bg-gray-200"
                        />
                    </div>
                    <div className='my-2'>
                        <div className='my-1'>핸드폰</div>
                        <input
                            name="phone"
                            value={userInfo.phone}
                            onChange={handleInputChange}
                            className="w-full border rounded p-2 mb-2"
                        />
                    </div>
                </div>
                <button className="my-2 bg-main-red-color opacity-75 rounded text-white py-1 px-3" onClick={handleSubmit}>
                    저장
                </button>
                {showSuccessPopup && (
                    <div className="popup absolute top-0 l-0 w-full h-full bg-black/50 flex justify-center">
                        <div className='bg-white p-3 rounded mt-10 w-1/3 h-36 flex items-center flex-col'>
                            <div className='h-24 flex items-center'>정보가 수정되었습니다.</div>
                            <button onClick={handlePopupClose} className='w-16 text-white bg-main-red-color py-0.5 px-3'>확인</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default MyPageSetting;