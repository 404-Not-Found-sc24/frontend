import * as React from 'react';
import {useState, useEffect, useCallback, ChangeEvent} from 'react';
import Modal from '../components/Modal';
import {Link, useNavigate} from 'react-router-dom';
import Calendar from 'react-calendar';
import '../Calendar.css';
import MakePlan from './MakePlan';
import axios, {AxiosError} from 'axios';
import {useAuth} from "../context/AuthContext";

interface props {
    isOpen: boolean;
    city: string;
    handleCloseModal: () => void;
}

const MakeTrip = ({isOpen, city, handleCloseModal}: props) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [title, setTitle] = useState('');
    const {accessToken, refreshAccessToken} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // externalParameter에 변화가 있을 때만 modalOpen 상태를 변경
        if (isOpen !== modalOpen) {
            setStep(1);
            setModalOpen(isOpen);
        }
    }, [isOpen]);

    const handleDateChange = useCallback(
        (value: any, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            if (!startDate || (startDate && endDate)) {
                // 시작일이 없거나 시작일과 종료일이 모두 선택된 경우에는 새로운 시작일 설정
                if (Array.isArray(value)) {
                    setStartDate(value[0]);
                    setEndDate(value[1]);
                } else {
                    setStartDate(value);
                    setEndDate(null);
                }
            } else {
                // 시작일이 선택된 상태이고 종료일이 선택되지 않은 경우에는 종료일 설정
                if (Array.isArray(value)) {
                    setEndDate(value[1]);
                } else {
                    if (value >= startDate!) {
                        setEndDate(value);
                    } else {
                        setEndDate(startDate!);
                        setStartDate(value);
                    }
                }
            }
        },
        [startDate, endDate],
    );

    const handleResetDates = () => {
        setStartDate(null);
        setEndDate(null);
    };

    const getKoreanDateString = (date: Date | null) => {
        if (!date) return '';

        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const months = [
            '1월',
            '2월',
            '3월',
            '4월',
            '5월',
            '6월',
            '7월',
            '8월',
            '9월',
            '10월',
            '11월',
            '12월',
        ];

        const dayOfWeek = days[date.getDay()];
        const month = months[date.getMonth()];

        return `${date.getFullYear()}년 ${month} ${date.getDate()}일 (${dayOfWeek})`;
    };

    const startDateString = getKoreanDateString(startDate);
    const endDateString = getKoreanDateString(endDate);

    const handlePrevStep = useCallback(() => {
        setStep((prevStep) => prevStep - 1);
    }, []);

    const handleNextStep = useCallback(() => {
        setStep((prevStep) => prevStep + 1);
    }, []);

    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    }, []);

    const goHome = useCallback(() => {
        navigate('/');
    }, []);

    const naviPage = useCallback(() => {
        navigate('/makeplan', {
            state: {
                startDate: startDate,
                endDate: endDate,
                city: city,
                name: title,
            },
        });
    }, []);

    const savePlan = async () => {
        try {
            const startDateString = startDate instanceof Date ? startDate.toISOString() : '';
            const endDateString = endDate instanceof Date ? endDate.toISOString() : '';
            const startDateObject = new Date(startDateString);
            const startPlanDate = startDateObject.toISOString().split('T')[0];
            const endDateObject = new Date(endDateString);
            const endPlanDate = endDateObject.toISOString().split('T')[0];

            console.log(title, city, startPlanDate, endPlanDate);
            const requestData = {
                name: title,
                location: city,
                startDate: startPlanDate,
                endDate: endPlanDate
            };

            await axios
                .post('/schedule', requestData, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((response) => {
                    console.log(response);
                    setStep((prevStep) => prevStep + 1);
                });
        } catch (error) {
            if (
                (error as AxiosError).response &&
                (error as AxiosError).response?.status === 401
            ) {
                try {
                    await refreshAccessToken();
                } catch (refreshError) {
                    console.error('Failed to refresh access token:', refreshError);
                }
            } else {
            }
        }
    };

    return (
        <>
            {modalOpen && (
                <Modal onClose={handleCloseModal}>
                    <>
                        {step === 1 && (
                            <>
                                <div className="font-['Nanum Gothic'] text-3xl font-semibold text-black mb-5">
                                    {city}
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>서울은 ~~</div>
                                    <img src="" width="400px" alt="지역소개사진"></img>
                                </div>
                                <div className="flex justify-center mt-10">
                                    <button
                                        className="bg-[#FF9A9A] rounded-md px-10 py-2 text-xl font-['BMJUA']"
                                        onClick={handleNextStep}
                                    >
                                        다음
                                    </button>
                                </div>
                            </>
                        )}
                        {step === 2 && (
                            <div className="flex justify-center items-center flex-col">
                                <div className="font-['Nanum Gothic'] text-2xl mb-6">
                                    여행 기간이 어떻게 되시나요?
                                </div>
                                <div className="calendar-container flex w-full mb-4 justify-center">
                                    <Calendar
                                        value={startDate}
                                        onChange={handleDateChange}
                                        selectRange={true}
                                        view="month"
                                        prev2Label={null}
                                        next2Label={null}
                                        calendarType="gregory"
                                        formatDay={(locale, date) =>
                                            date.toLocaleString('en', {day: 'numeric'})
                                        }
                                    />
                                </div>
                                {startDate && endDate ? (
                                    <div>
                                        <p className="text-center">
                                            {startDateString}{' '}
                                            <span className="font-['BMJUA'] bold text-lg">부터 </span>
                                            {endDateString}{' '}
                                            <span className="font-['BMJUA'] bold text-lg">
                        까지 여행
                      </span>
                                        </p>
                                    </div>
                                ) : (
                                    <></>
                                )}
                                <button
                                    className="font-['Nanum Gothic'] flex justify-center text-[10px] mt-2 text-[#FF9A9A] underline"
                                    onClick={handleResetDates}
                                >
                                    날짜 다시 설정하기
                                </button>
                                <div className="flex justify-center mt-2 w-64 justify-between">
                                    <button
                                        className="border-2 border-[#FF9A9A] bg-white rounded-md px-10 py-2 text-xl font-['BMJUA']"
                                        onClick={handlePrevStep}
                                    >
                                        이전
                                    </button>
                                    <button
                                        className="border-4 border-[#FF9A9A] bg-[#FF9A9A] rounded-md px-10 py-2 text-xl font-['BMJUA']"
                                        onClick={handleNextStep}
                                    >
                                        다음
                                    </button>
                                </div>
                            </div>
                        )}
                        {step === 3 && (
                            <div className="flex justify-center items-center flex-col">
                                <div className="font-['Nanum Gothic'] text-2xl mb-6">
                                    여행 일정의 이름을 지어주세요!
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        value={title}
                                        placeholder="일기 제목"
                                        className="w-72 p-2 mx-2 my-2 border-2 border-gray rounded-md font-['BMJUA']"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex justify-center mt-2 w-64 justify-between">
                                    <button
                                        className="border-2 border-[#FF9A9A] bg-white rounded-md px-10 py-2 text-xl font-['BMJUA']"
                                        onClick={handlePrevStep}
                                    >
                                        이전
                                    </button>
                                    <button
                                        className="border-4 border-[#FF9A9A] bg-[#FF9A9A] rounded-md px-10 py-2 text-xl font-['BMJUA']"
                                        onClick={savePlan}
                                    >
                                        생성
                                    </button>
                                </div>
                            </div>
                        )}
                        {step === 4 && (
                            <div className="flex justify-center items-center flex-col">
                                <div className="font-['Nanum Gothic'] text-2xl mb-6">
                                    여행 장소 추가하러 가기!
                                </div>
                                <div className="flex justify-center mt-2 w-64 justify-between">
                                    <button
                                        className="border-2 border-[#FF9A9A] bg-white rounded-md px-2 py-2 text-md font-['BMJUA']"
                                        onClick={goHome}
                                    >
                                        나중에 하기
                                    </button>
                                    <button
                                        className="border-4 border-[#FF9A9A] bg-[#FF9A9A] rounded-md px-2 py-2 text-md font-['BMJUA']"
                                        onClick={naviPage}
                                    >
                                        지금 하러 가기!
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                </Modal>
            )}
        </>
    );
};
export default MakeTrip;
