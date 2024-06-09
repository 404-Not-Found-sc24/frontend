import '../index.css';
import React from "react";
import Place from "../../types/Place";

interface CityBoxProps {
    place: Place;
    addSelectedPlace: (place: Place) => void;
}

const PlaceBox: React.FC<CityBoxProps> = ({place, addSelectedPlace}) => {
    const handleSelectPlace = () => {
        addSelectedPlace(place);
    };
    return (
        <div 
            className="w-40 2xl:w-44 h-48 m-2 flex flex-col cursor-pointer rounded-lg overflow-hidden shadow-lg transform transition-transform hover:-translate-y-1 hover:shadow-xl"
            onClick={handleSelectPlace}
        >
            <div className="w-full h-36">
                {place.imageUrl ? (
                    <img
                        src={place.imageUrl}
                        alt={place.name}
                        className="w-full h-full max-h-36 object-cover"
                    />
                ) : (
                    <img
                        src={process.env.PUBLIC_URL + '/image/logo.png'}
                        alt="default"
                        className="w-full h-full object-cover"
                    />
                )}
            </div>
            <div className="w-full h-12 bg-black bg-opacity-60 flex items-center justify-center text-white text-lg font-bold p-2 border-t  font-['BMHANNApro'] border-gray-200">
                {place.name.length > 7 ? `${place.name.slice(0, 6)}...` : place.name}
            </div>
        </div>
    );
};

export default PlaceBox;