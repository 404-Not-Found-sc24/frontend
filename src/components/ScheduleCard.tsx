import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface ScheduleData {
    scheduleId: number;
    name: string;
    location: string;
    startDate: string;
    endDate: string;
    share: number;
    imageUrl: string;
}

interface ScheduleCardProps {
    data: ScheduleData;
    onDeleteSchedule: (scheduleId: number) => void;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ data, onDeleteSchedule }) => {
    const { scheduleId, name, location, startDate, endDate, share, imageUrl } = data;
    const [differenceInDays, setDifferenceInDays] = useState<number>();
    const { accessToken, refreshAccessToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        checkDate();
    }, []);

    const checkDate = async () => {
        const sDate = new Date(startDate);
        const eDate = new Date(endDate);
        const currentDate = new Date();
        sDate.setHours(0, 0, 0, 0);
        eDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        if (currentDate > eDate) {
            const differenceInMilliseconds = currentDate.getTime() - eDate.getTime();
            setDifferenceInDays(Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24)));
        }
        else if (currentDate <= eDate && currentDate >= sDate) {
            setDifferenceInDays(0);
        }
        else if (currentDate < sDate) {
            const differenceInMilliseconds = currentDate.getTime() - sDate.getTime();
            setDifferenceInDays(Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24)));
        }


    };

    const handleScheduleClick = (data: ScheduleData) => {
        // 페이지 이동 처리
        navigate("/myplanpage", { state: { data } });
    };

    const handleDeleteSchedule = async (e: React.MouseEvent<HTMLImageElement, MouseEvent>, scheduleId: number) => {
        e.stopPropagation(); // 클릭 이벤트 전파 방지
        // 일정 삭제 처리
        await deleteSchedule(scheduleId);
        // 알림 또는 다른 작업 수행
    };


    const notifySuccess = () =>
        toast.success('일정이 성공적으로 삭제되었습니다.', {
            position: 'top-center',
        });
    const notifyError = () =>
        toast.error('일정 삭제 중 오류가 발생했습니다.', {
            position: 'top-center',
        });


    const deleteSchedule = async (scheduleId: number) => {
        try {
            // 복사된 일정 데이터를 서버에 전송하여 저장합니다.
            const response = await axios.delete(`/schedule/${scheduleId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            // 저장이 완료되면 사용자에게 알립니다. (예: 모달, 알림 등)
            console.log('일정이 성공적으로 삭제되었습니다:', response.data);
            notifySuccess();
            onDeleteSchedule(scheduleId);
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
                console.error('일정 삭제 중 오류 발생:', error);
                notifyError();
            }
        }
    }

    return (
        <div className='w-full flex p-5 h-44 shadow-md' onClick={() => handleScheduleClick(data)}>
            <div className='flex w-full'>
                <div className='w-60 h-full mr-5'>
                    {
                        imageUrl !== null ?
                            <img src={imageUrl} alt="" className='h-full w-full'></img>
                            :
                            <div className='flex h-full w-full border-2 text-center justify-center items-center'>사진이 없습니다.</div>
                    }
                </div>
                <div className='flex flex-col w-full'>
                    <div className='flex flex-row'>
                        <div className='text-main-red-color text-xl font-bold w-20 mr-5'>
                            {differenceInDays !== undefined && (differenceInDays === 0 ? "D-Day" : `D${differenceInDays > 0 ? '+' : '-'}${Math.abs(differenceInDays)}`)}
                        </div>

                        <div className='text-xl flex-grow'>{location}</div>
                        <div className='text-xl w-20'>{share == 1 ? 'PUBLIC' : 'PRIVATE'}</div>
                    </div>
                    <div className='flex flex-grow items-center justify-start'>
                        <div className='text-3xl font-bold'>{name}</div>
                    </div>
                    <div className='flex justify-between'>
                        <div className='texl-lg font-medium'>{startDate} ~ {endDate}</div>
                        <img src={`${process.env.PUBLIC_URL}/image/recycle-bin.png`} alt="휴지통" className='w-5 h-5 text-main-red-color' onClick={(e) => handleDeleteSchedule(e, data.scheduleId)}></img>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleCard;