import React from 'react';

interface PlanData {
  scheduleId: string;
  name: string;
  startDate: string;
  endDate: string;
  userName: string;
  imageUrl: string;
}

interface PlaceData {
  city: string;
  keyword: string;
}

interface Props {
  data: (PlanData | PlaceData)[];
  searchTerm: string;
}

const SearchResults: React.FC<Props> = ({ data, searchTerm }) => {
  const normalizedSearchTerm = searchTerm.toLowerCase();

  return (
    <div>
      {data.map((item, index) => (
        <div key={index} className="bg-gray-100 p-4 mb-4 rounded-lg">
          {'name' in item &&
            'startDate' in item &&
            item.name.toLowerCase().includes(normalizedSearchTerm) && (
              <div>
                <h3>{item.name}</h3>
                <p>
                  {item.startDate} - {item.endDate}
                </p>
              </div>
            )}
          {'city' in item &&
            'keyword' in item &&
            item.city.toLowerCase().includes(normalizedSearchTerm) && (
              <div>
                <h3>{item.city}</h3>
                <p>{item.keyword}</p>
              </div>
            )}
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
