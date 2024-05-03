import React, { createContext, useState, useContext } from 'react';

interface MapContextState {
  latitude: number;
  longitude: number;
}

interface MapContextType extends MapContextState {
  setMapLocation: (lat: number, lng: number) => void;
}

interface MapProviderProps {
  initialCenter: MapContextState;
  children: React.ReactNode;
}

export const MapContext = createContext<MapContextType | undefined>(undefined);

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};

export const MapProvider: React.FC<MapProviderProps> = ({
  initialCenter,
  children,
}) => {
  const [mapCenter, setMapCenter] = useState<MapContextState>(initialCenter);

  const setMapLocation = (lat: number, lng: number) => {
    setMapCenter({ latitude: lat, longitude: lng });
  };

  console.log(mapCenter);

  return (
    <MapContext.Provider value={{ ...mapCenter, setMapLocation }}>
      {children}
    </MapContext.Provider>
  );
};
