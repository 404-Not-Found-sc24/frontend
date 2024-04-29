import '../index.css';
import * as React from "react";
import Place from '../../types/Place';

interface DayPlaceProps {
    index: number;
    selectedPlaces: Place[];
    removePlace: (dayIndex: number, placeIndex: number) => void;
}

const DayPlace: React.FC<DayPlaceProps> = ({ index, selectedPlaces, removePlace }) => {
    const handleRemovePlace = (placeIndex: number) => {
        removePlace(placeIndex, index);
    };
    console.log(selectedPlaces[1]);
    return (
        <div key={index} className="w-11/12 h-20 flex items-center mb-3">
            <button className="delete mr-3" onClick={() => handleRemovePlace(index)}></button>
            <div className="w-full h-full rounded-md shadow-xl flex items-center">
                <img
                    src={selectedPlaces[index].imageUrl}
                    alt="City Image"
                    className="rounded-md w-[60px] h-[60px] ml-3"
                />
                <div className="w-full ml-3">
                    <div className="font-extrabold text-lg font-['Nanum Gothic']"
                         style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}
                    >
                        {selectedPlaces[index].name.length > 9 ? `${selectedPlaces[index].name.slice(0, 9)}...` : selectedPlaces[index].name}</div>
                    <div className="text-sm font-['Nanum Gothic']"
                         style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}
                    >
                        {selectedPlaces[index].address.length > 14 ? `${selectedPlaces[index].address.slice(0, 14)}...` : selectedPlaces[index].address}</div>
                </div>
                <div className="menu relative right-5"></div>
            </div>
        </div>
    );
};

export default DayPlace;