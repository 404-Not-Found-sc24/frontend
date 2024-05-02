import '../index.css';
import * as React from "react";
import Place from '../../types/Place';
import {useEffect} from "react";

interface DayPlaceProps {
    index: number;
    selectedPlace: Place;
    removePlace: (placeIndex: number) => void;
}

const DayPlace: React.FC<DayPlaceProps> = ({index, selectedPlace, removePlace}) => {
    const handleRemovePlace = () => {
        removePlace(index);
    };
    useEffect(() => {
        console.log(selectedPlace);
    }, []);
    return (
        <div className="w-11/12 h-20 flex items-center mb-3">
            <button className="delete mr-3" onClick={() => handleRemovePlace()}></button>
            <div className="w-full h-full rounded-md shadow-xl flex items-center">
                <img
                    src={selectedPlace.imageUrl}
                    alt="City Image"
                    className="rounded-md w-[60px] h-[60px] ml-3"
                />
                <div className="w-full ml-3">
                    <div className="font-extrabold text-lg font-['Nanum Gothic']"
                         style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}
                    >
                        {selectedPlace.name.length > 9 ? `${selectedPlace.name.slice(0, 9)}...` : selectedPlace.name}</div>
                    <div className="text-sm font-['Nanum Gothic']"
                         style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}
                    >
                        {selectedPlace.address.length > 14 ? `${selectedPlace.address.slice(0, 14)}...` : selectedPlace.address}</div>
                </div>
                <div className="menu relative right-5"></div>
            </div>
        </div>
    );
};

export default DayPlace;