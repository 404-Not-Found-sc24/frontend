import '../index.css';
import React from "react";
import Place from "../../types/Place";

interface CityBoxProps {
    place: Place;
}

const PlaceBox: React.FC<CityBoxProps> = ({place}) => {
    return (
        <div className="w-40 h-40 relative flex flex-col">
            <img
                src={process.env.PUBLIC_URL + '/image/image 15.png'}
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