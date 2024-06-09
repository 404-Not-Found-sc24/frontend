import React, { useEffect } from 'react';
import { useMap } from '../context/MapContext';

declare global {
    interface Window {
        kakao: any;
    }
}

interface LocationAndTime {
    locationName: string;
    time: string;
}

interface LocationAndLngLat {
    locationName: string;
    longitude: number;
    latitude: number;
}

interface MapProps {
    onMapClick?: (lat: number, lng: number) => void;
    isLine?: boolean;
    isClicked?: boolean;
    isSearch?: boolean;
    mapData?: LocationAndTime[];
    searchData?: LocationAndLngLat[];
}

const Map: React.FC<MapProps> = ({ onMapClick, isLine, isClicked, isSearch, mapData, searchData }) => {
    const { markers, centerPosition, addMarker, removeMarker } = useMap();

    useEffect(() => {
        if (window.kakao && window.kakao.maps) {
            const mapContainer = document.getElementById('map');
            const mapOption = {
                center: new window.kakao.maps.LatLng(centerPosition.latitude, centerPosition.longitude),
                level: 3,
            };

            const map = new window.kakao.maps.Map(mapContainer, mapOption);

            const overlayInfos = mapData?.map(info => ({
                title: info.locationName,
                time: info.time,
            }));

            if (markers.length > 0) {
                markers.forEach((marker, index) => {
                    const markerPosition = new window.kakao.maps.LatLng(marker.latitude, marker.longitude);
                    const mapMarker = new window.kakao.maps.Marker({
                        position: markerPosition,
                    });
                    mapMarker.setMap(map);

                    if (mapData && mapData[index]) {
                        const info = mapData[index];
                        const content = `
                            <div class="bg-white rounded-md w-fit h-[50px] p-2 shadow-lg">
                                <div class="accommInfoWrap">
                                    <h1 class="text-sm font-bold">${info.locationName}</h1>
                                    <p class="text-xs">${info.time}</p>
                                </div>
                            </div>
                        `;

                        const customOverlay = new window.kakao.maps.CustomOverlay({
                            position: markerPosition,
                            content: content,
                            yAnchor: 1.5, // 오버레이의 y 앵커를 조정하여 마커 위에 위치하게 함
                        });

                        customOverlay.setMap(map);
                    }

                    if (searchData && isSearch) {
                        const info = searchData[0];
                        const centerPosition = new window.kakao.maps.LatLng(info.latitude, info.longitude);
                        const content = `
                            <div class="bg-white rounded-md w-fit h-fit p-2 shadow-md">
                                <div class="accommInfoWrap">
                                    <h1 class="text-sm font-bold">${info.locationName}</h1>
                                </div>
                            </div>
                        `;

                        const customOverlay = new window.kakao.maps.CustomOverlay({
                            position: centerPosition,
                            content: content,
                            yAnchor: 1.5, // 오버레이의 y 앵커를 조정하여 마커 위에 위치하게 함
                        });

                        customOverlay.setMap(map);
                    }
                });
            }

            if (isLine) {
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
            }

            // 클릭 이벤트 처리
            if (isClicked) {
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
        }
    }, [centerPosition, markers, addMarker, onMapClick, mapData, isLine, isClicked]);

    return <div id="map" className="w-2/5 2xl:w-1/2 h-full"></div>;
};

export default Map;
