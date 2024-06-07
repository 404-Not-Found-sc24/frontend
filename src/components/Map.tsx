import React, { useEffect } from 'react';
import { useMap } from '../context/MapContext';

declare global {
    interface Window {
        kakao: any;
    }
}

interface MapProps {
    onMapClick?: (lat: number, lng: number) => void;
}

const Map: React.FC<MapProps> = ({ onMapClick }) => {
    const { markers, centerPosition, addMarker, removeMarker } = useMap();

    useEffect(() => {
        if (window.kakao && window.kakao.maps) {
            const mapContainer = document.getElementById('map');
            const mapOption = {
                center: new window.kakao.maps.LatLng(centerPosition.latitude, centerPosition.longitude),
                level: 3,
            };

            const map = new window.kakao.maps.Map(mapContainer, mapOption);

            // 기존 마커를 모두 삭제
            markers.forEach(({ latitude, longitude }) => {
                const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition,
                });
                marker.setMap(map);
            });

            if (markers.length > 1) {
                const linePath = markers.map(marker => new window.kakao.maps.LatLng(marker.latitude, marker.longitude));

                const polyline = new window.kakao.maps.Polyline({
                    path: linePath,
                    strokeWeight: 5,
                    strokeColor: '#000000',
                    strokeOpacity: 0.8,
                    strokeStyle: 'solid',
                });

                polyline.setMap(map);
            }

            // 클릭 이벤트 처리
            window.kakao.maps.event.addListener(map, 'click', function (mouseEvent: any) {
                const latLng = mouseEvent.latLng;
                const lat = latLng.getLat();
                const lng = latLng.getLng();
                addMarker(Date.now(), lat, lng); // 임시 placeId로 Date.now() 사용
                if (onMapClick) {
                    onMapClick(lat, lng);
                }
            });
        }
    }, [centerPosition, markers, addMarker, onMapClick]);

    return <div id="map" className="w-2/5 h-full"></div>;
};

export default Map;
