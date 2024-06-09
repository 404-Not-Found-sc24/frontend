import * as React from 'react';
import {useState, useEffect, useCallback, ChangeEvent} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Calendar from 'react-calendar';
import '../Calendar.css';
import MakePlan from './MakePlan';
import axios, {AxiosError} from 'axios';
import {useAuth} from '../context/AuthContext';
import {toast} from 'react-toastify';
import ModalMid from "../components/ModalMid";
import ScheduleData from "../../types/ScheduleData";

interface props {
    isOpen: boolean;
    scheduleId: number;
    handleCloseModal: () => void;
}

const PastePlace = ({isOpen, scheduleId, handleCloseModal}: props) => {
    const [modalOpen, setModalOpen] = useState(false);
    const {accessToken, refreshAccessToken} = useAuth();
    const navigate = useNavigate();
    const [scheduleName, setScheduleName] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const [step, setStep] = useState(1);

    useEffect(() => {
        // externalParameter에 변화가 있을 때만 modalOpen 상태를 변경
        if (isOpen !== modalOpen) {
            setModalOpen(isOpen);
        }
    }, [isOpen]);

    const handleScheduleName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setScheduleName(event.target.value);
    };

    const handleStartDate = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(event.target.value);
    }

    const handleEndDate = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(event.target.value);
    }

  const handlePrevStep = useCallback(() => {
    setStep((prevStep) => prevStep - 1);
  }, []);

  const handleNextStep = useCallback(() => {
    setStep((prevStep) => prevStep + 1);
  }, []);

    const notifySuccess = () =>
        toast.success('일정이 성공적으로 저장되었습니다.', {
            position: 'top-center',
        });
    const notifyError = () =>
        toast.error('일정 작성 중 오류가 발생했습니다.', {
            position: 'top-center',
        });

    const copySchedule = async () => {
        try {
            // 복사된 일정 데이터를 서버에 전송하여 저장합니다.
            const response = await axios.post(
                `/tour/schedules/${scheduleId}`,
                {name: scheduleName, startDate: startDate, endDate: endDate},
                {
                    headers: {Authorization: `Bearer ${accessToken}`},
                },
            );
            // 저장이 완료되면 사용자에게 알립니다. (예: 모달, 알림 등)
            console.log('일정이 성공적으로 복사되었습니다:', response.data);
            notifySuccess();
            const id = setTimeout(() => {
                navigate('/');
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
                console.error('일정 복사 중 오류 발생:', error);
                notifyError();
            }
        }
    };

    return (
        <>
            {modalOpen && (
                <ModalMid onClose={handleCloseModal}>
                    <div className="flex justify-center items-center flex-col">
                        {step == 1 && (
                            <>
                                <div className="font-['BMJUA'] text-2xl mb-6">
                                    내 일정으로 <span className="text-[#ff9a9a]">복사</span>하기
                                </div>
                                <>
                                    <div className="flex w-full flex-col">
                                        <div className="mb-3">
                                            <div className="flex flex-row justify-start">
                                                <div className="bg-main-red-color w-[5px] h-[20px] rounded-lg"></div>
                                                <div className="font-['BMJUA'] text-md ml-2">일정 명</div>
                                            </div>
                                            <div className="flex">
                                                <input
                                                    className="w-full h-[50px] rounded-md shadow-xl px-3 font-['Nanum Gothic'] text-md font-bold"
                                                    placeholder="새로운 일정 이름을 입력해주세요!"
                                                    onChange={handleScheduleName}
                                                    value={scheduleName ? scheduleName : ''}/>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <div className="flex flex-row justify-start">
                                                <div className="bg-main-red-color w-[5px] h-[20px] rounded-lg"></div>
                                                <div className="font-['BMJUA'] text-md ml-2">날짜</div>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="date"
                                                    className="w-1/2 h-[50px] rounded-md shadow-xl px-3 font-['Nanum Gothic'] text-md font-bold"
                                                    onChange={handleStartDate}
                                                    value={startDate ? startDate : ''}/>
                                                <p className="font-bold mx-3"> ~ </p>
                                                <input
                                                    type="date"
                                                    className="w-1/2 h-[50px] rounded-md shadow-xl px-3 font-['Nanum Gothic'] text-md font-bold"
                                                    onChange={handleEndDate}
                                                    value={endDate ? endDate : ''}/>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        className="mt-5 border-4 border-[#FF9A9A] bg-[#FF9A9A] rounded-md px-8 py-2 text-xl font-['BMJUA']"
                                        onClick={handleNextStep}
                                    >
                                        확인
                                    </button>
                                </>
                            </>
                        )}
                      {step == 2 && (
                          <>
                              <div className="font-['Nanum Gothic'] text-xl font-bold mb-5">[유의사항]</div>
                            <div className="font-['Nanum Gothic'] text-md font-bold">새로 선택한 여행 기간이 기존 여행 기간보다 짧은 경우,<br /> 여행 일정이 <span className="text-[#ff9a9a]">모두 복사되지 않습니다.</span>
                              <br />여행 일정은 첫번째 날을 기준으로 복사됩니다.
                            </div>
                            <div>
                              <button
                                  className="mt-5 border-4 border-[#FF9A9A] bg-[#FF9A9A] rounded-md px-8 py-2 text-xl font-['BMJUA'] mr-3"
                                  onClick={handlePrevStep}
                              >
                                취소
                              </button>
                              <button
                                  className="mt-5 border-4 border-[#FF9A9A] bg-[#FF9A9A] rounded-md px-8 py-2 text-xl font-['BMJUA'] ml-3"
                                  onClick={copySchedule}
                              >
                                확인
                              </button>
                            </div>
                          </>
                      )}
                    </div>
                </ModalMid>
            )}
        </>
    );
};
export default PastePlace;
