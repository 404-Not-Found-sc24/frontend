import React from 'react';
import {Link, useNavigate} from 'react-router-dom';

interface PlaceData {
    locationId: number;
    name: string;
    address: string;
    imageUrl: string;
}

interface PlanData {
    scheduleId: string;
    name: string;
    startDate: string;
    endDate: string;
    userName: string;
    imageUrl: string;
}

interface Props {
    data: (PlaceData | PlanData)[];
    searchTerm: string;
    tab: string;
}

const SearchResults: React.FC<Props> = ({data, searchTerm, tab}) => {
    const normalizedSearchTerm = searchTerm.toLowerCase();
    const navigate = useNavigate();
    const navigateToDiary = (locationId: number, name: string) => {
        navigate(`/searchresultdiary/${locationId}`, {
            state: {placeName: name},
        });
    };

    return (
        <div className="bg-white p-10 max-h-[660px] overflow-y-auto">
            {tab === '장소 보기' &&
                data
                    .filter((item): item is PlaceData => 'locationId' in item)
                    .map((place: PlaceData, index) => (
                        <Link
                            key={index}
                            to={{
                                pathname: '/placeinfo',
                            }}
                            state={{place}}
                            className="w-full h-[30%] p-5 flex rounded-md shadow-xl mb-2"
                        >
                            <div>
                                <div
                                    onClick={() => navigateToDiary(place.locationId, place.name)}
                                    style={{cursor: 'pointer'}}
                                >
                                    <div className="flex">
                                        {place.imageUrl ? (
                                            <img
                                                src={place.imageUrl}
                                                alt={place.name}
                                                className="w-32 h-32 mt-2"
                                            />
                                        ) : (
                                            <div
                                                className="border-2 flex w-32 h-32 mt-2 text-gray-600 justify-center items-center">
                                                사진이 없습니다.
                                            </div>
                                        )}

                                        <div className="flex flex-col p-2">
                                            <h3 className="font-[BMJUA] text-xl">{place.name}</h3>
                                            <p className="font-[Nanum Gothic] text-gray-600">
                                                {place.address}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
            {tab === '일정 보기' &&
                data
                    .filter((item): item is PlanData => 'scheduleId' in item)
                    .map((plan: PlanData, index) => (
                        <div key={index} className="bg-gray-100 p-4 mb-4 rounded-lg">
                            <div>
                                <h3 className="font-bold text-lg">{plan.name}</h3>
                                <p className="text-gray-600">
                                    {plan.startDate} - {plan.endDate}
                                </p>
                                {plan.imageUrl && (
                                    <img
                                        src={plan.imageUrl}
                                        alt={plan.name}
                                        className="w-32 h-32 mt-2"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
        </div>
    );
};
export default SearchResults;