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
        <div className="w-40 h-40 relative flex flex-col cursor-pointer" onClick={handleSelectPlace}>
            {place.imageUrl ? (
                <img
                    src={place.imageUrl}
                    alt={place.name}
                    className="rounded-4 w-full h-full object-cover"
                />
            ) : (
                <div
                    className="rounded-4 w-full h-full border-2 flex w-32 h-32 mt-2 text-gray-600 justify-center items-center text-center">
                    {place.name}
                </div>
            )}
            <div
                className="absolute bottom-0 right-0 text-2xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br z-10"
                style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}
            >
                {place.name.length > 7 ? `${place.name.slice(0, 6)}...` : place.name}
            </div>
        </div>
    );
};

export default PlaceBox;