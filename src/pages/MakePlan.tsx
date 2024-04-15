import * as React from 'react';
import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import '../index.css';

declare global {
    interface Window {
        kakao: any;
    }
}

const MakePlan = () => {
    const location = useLocation();
    const tripInfo = { ...location.state };
    const navigate = useNavigate();

    console.log(tripInfo.startDate, tripInfo.endDate, tripInfo.city);

    if (tripInfo.startDate && tripInfo.endDate) {
        const differenceInTime = tripInfo.endDate.getTime() - tripInfo.startDate.getTime();
        const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
        const tripDays = differenceInDays + 1;
        console.log('여행 기간:', tripDays, '일'); // 일수를 출력할 때 +1을 해줍니다.
    }

    useEffect(() => {
        const container = document.getElementById("map");
        const options = {
            center: new window.kakao.maps.LatLng(37.2795, 127.0438),
            level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);

        const positions = [
            {
                title: '모각소',
                latlng: new window.kakao.maps.LatLng(37.2795, 127.0438)
            },
            {
                title: 'test',
                latlng: new window.kakao.maps.LatLng(37.2785, 127.0428)
            }
        ];
        for (var i = 0; i < positions.length; i++) {
            const marker = new window.kakao.maps.Marker({
                map: map,
                position: positions[i].latlng,
                title: positions[i].title,
            });
        }
    }, []);

    const naviBack = () => {
        navigate('/');
    };

    return (
        <div className="w-screen h-screen flex">
            <div className="w-1/2 flex">
                <div className="w-1/2 h-screen flex flex-col">
                    <div className="flex">
                        <i className="backArrow ml-2 cursor-pointer" onClick={naviBack}></i>
                        <div className="font-['Nanum Gothic'] text-3xl font-semibold text-black ml-2 w-72 flex items-center">{tripInfo.city}</div>
                    </div>
                    <div className="grid grid-cols-2 justify-items-center items-center gap-3 mt-4">
                        <div className="w-40 h-40 relative flex flex-col">
                            <img
                                src={process.env.PUBLIC_URL + '/image/image 15.png'}
                                alt="City Image"
                                className="rounded-4"
                            />
                            <button className="plus absolute top-1 right-1 z-10 rounded-md"></button>
                            <div
                                className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br z-10">
                                Title
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-1/2 h-screen flex">
                    <div className="tabs w-[30px]">
                        <div className="tab">Tab 1</div>
                        <div className="tab">Tab 2</div>
                        <div className="tab">Tab 3</div>
                    </div>
                    <div className="w-full h-screen border-4 border-[#FF9A9A]"></div>
                </div>
            </div>
            <div id="map" className="w-1/2"></div>
        </div>
    );
};

export default MakePlan;