import '../index.css';
import React from "react";
import Place from "../../types/Place";

interface CityBoxProps {
    place: Place;
    addSelectedPlace: (place: Place) => void;
}

const PlaceBox: React.FC<CityBoxProps> = ({ place, addSelectedPlace }) => {
    const handleSelectPlace = () => {
        addSelectedPlace(place);
    };
    return (
        <div className="w-40 h-40 relative flex flex-col cursor-pointer" onClick={handleSelectPlace}>
            <img
                src={place.imageUrl}
                alt="City Image"
                className="rounded-4"
            />
            <div
                className="absolute bottom-0 right-0 text-4xl font-['BMHANNApro'] text-white bg-black bg-opacity-50 p-2 rounded-tl rounded-br z-10"
                style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}
            >
                {place.name.length > 4 ? `${place.name.slice(0, 4)}...` : place.name}
            </div>
        </div>
    );
};

export default PlaceBox;