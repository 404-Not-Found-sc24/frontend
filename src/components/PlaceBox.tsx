import '../index.css';
import * as React from "react";

interface CityBoxProps {
}

const PlaceBox: React.FC<CityBoxProps> = () => {
    return (
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
    );
};

export default PlaceBox;