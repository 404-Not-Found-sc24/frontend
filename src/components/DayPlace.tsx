import '../index.css';
import * as React from "react";
import Place from '../../types/Place';

interface DayPlaceProps {
    place: Place;
    selectedPlaces: Array<Place>;
    removePlace: (place: Place) => void;
}

const DayPlace: React.FC<DayPlaceProps> = ({ place, selectedPlaces, removePlace }) => {
    const handleRemovePlace = () => {
        removePlace(place);
    };
    
    return (
        <div className="w-11/12 h-20 flex items-center mb-3">
            <button className="delete mr-3" onClick={handleRemovePlace}></button>
            <div className="w-full h-full rounded-md shadow-xl flex items-center">
                <img
                    src={place.imageUrl}
                    alt="City Image"
                    className="rounded-md w-[60px] h-[60px] ml-3"
                />
                <div className="w-full ml-3">
                    <div className="font-extrabold text-lg font-['Nanum Gothic']"
                         style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}
                    >
                        {place.name.length > 9 ? `${place.name.slice(0, 9)}...` : place.name}</div>
                    <div className="text-sm font-['Nanum Gothic']"
                         style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}
                    >
                        {place.address.length > 14 ? `${place.address.slice(0, 14)}...` : place.address}</div>
                </div>
                <div className="menu relative right-5"></div>
            </div>
        </div>
    );
};

export default DayPlace;