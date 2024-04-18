import '../index.css';
import * as React from "react";

interface PlaceBoxProps {
}

const PlaceBox: React.FC<PlaceBoxProps> = () => {
    return (
        <div className="w-11/12 h-20 flex items-center">
            <button className="delete mr-3"></button>
            <div className="w-full h-full rounded-md shadow-xl flex items-center">
                <img
                    src={process.env.PUBLIC_URL + '/image/image 15.png'}
                    alt="City Image"
                    className="rounded-md w-[60px] h-[60px] ml-3"
                />
                <div className="w-full ml-3">
                    <div className="font-extrabold text-lg font-['Nanum Gothic']">장소 이름</div>
                    <div className="text-sm font-['Nanum Gothic']">주소</div>
                </div>
                <div className="menu relative right-5"></div>
            </div>
        </div>
    );
};

export default PlaceBox;