import React, { useEffect } from 'react';
import { useMap } from '../context/MapContext';

declare global {
  interface Window {
    kakao: any;
  }
}

interface MapProps {
  center?: { latitude: number; longitude: number };
  onMapClick?: (lat: number, lng: number) => void;
}

const Map: React.FC<MapProps> = ({ center, onMapClick }) => {
  const { latitude, longitude, setMapLocation } = useMap();

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      const mapContainer = document.getElementById('map');
      const mapOption = {
        center: new window.kakao.maps.LatLng(latitude, longitude),
        level: 3,
      };

      const map = new window.kakao.maps.Map(mapContainer, mapOption);

      const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });

      marker.setMap(map);

      // 클릭 이벤트 처리
      window.kakao.maps.event.addListener(
        map,
        'click',
        function (mouseEvent: any) {
          const latLng = mouseEvent.latLng;
          const lat = latLng.getLat();
          const lng = latLng.getLng();
          setMapLocation(lat, lng);
          marker.setPosition(latLng);
          if (onMapClick) {
            onMapClick(lat, lng);
          }
        },
      );
    }
  }, [latitude, longitude, setMapLocation, onMapClick]);

  return <div id="map" className="w-1/2 h-full"></div>;
};

export default Map;
