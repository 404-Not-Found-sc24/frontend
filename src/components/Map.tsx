import React, {useState, useEffect} from 'react';

declare global {
    interface Window {
        kakao: any;
    }
}

const Map: React.FC = () => {

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

    return (
        <div id="map" className="w-1/2 h-full"></div>
    );
};

export default Map;
