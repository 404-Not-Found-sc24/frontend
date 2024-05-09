import React, { useState, useEffect } from 'react';

interface ScheduleCardProps {
    props: {
        scheduleId: number,
        name: string,
        location: string,
        startDate: string,
        endDate: string,
        share: number,
        imageUrl: string,
    }
}

const ScheduleCard: React.FC<ScheduleCardProps> = (props) => {
    const { scheduleId, name, location, startDate, endDate, share, imageUrl } = props.props;
    const [differenceInDays, setDifferenceInDays] = useState<number> ();

    useEffect (() => {
        checkDate();
    }, []);

    const checkDate = async () => {
        const nextDate = new Date(startDate);
        const currentDate = new Date();
        const differenceInMilliseconds = nextDate.getTime() - currentDate.getTime();

        // 밀리초를 일로 변환하여 차이 계산
        setDifferenceInDays(Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24)));

    }

    return (
        <div className='w-full flex p-5 h-44 shadow-md'>
            <div className='flex w-full'>
                <div className='w-60 h-full mr-5'>
                    <img src={`${process.env.PUBLIC_URL}/image/image 15.png`} alt="" className='h-full max-w-60'></img>
                </div>
                <div className='flex flex-col w-full'>
                    <div className='flex flex-row'>
                        <div className='text-main-red-color text-xl font-bold w-20 mr-5'>
                        {differenceInDays !== undefined && (differenceInDays === 0 ? "D-Day" : `D${differenceInDays < 0 ? '+' : '-'}${Math.abs(differenceInDays)}`)}
                        </div>

                        <div className='text-xl flex-grow'>{location}</div>
                        <div className='text-xl w-20'>{share == 1 ? 'PUBLIC' : 'PRIVATE'}</div>
                    </div>
                    <div className='flex flex-grow items-center justify-start'>
                        <div className='text-3xl font-bold'>{name}</div>
                    </div>
                    <div className='flex justify-between'>
                        <div className='texl-lg font-medium'>{startDate} ~ {endDate}</div>
                        <img src={`${process.env.PUBLIC_URL}/image/recycle-bin.png`} alt="휴지통" className='w-5 h-5 text-main-red-color'></img>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleCard;