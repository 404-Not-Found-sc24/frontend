// import React from 'react';

// interface PlanData {
//   scheduleId: string;
//   name: string;
//   startDate: string;
//   endDate: string;
//   userName: string;
//   imageUrl: string;
// }

// interface PlaceData {
//   locationId: number;
//   name: string;
//   address: string;
//   latitude: number;
//   longitude: number;
//   imageUrl: string;
// }

// interface Props {
//   data: (PlanData | PlaceData)[];
//   searchTerm: string;
// }

// const SearchResults: React.FC<Props> = ({ data, searchTerm }) => {
//   const normalizedSearchTerm = searchTerm.toLowerCase();

//   return (
//     <div>
//       {data.map((item, index) => (
//         <div key={index} className="bg-gray-100 p-4 mb-4 rounded-lg">
//           {'name' in item &&
//             'startDate' in item &&
//             item.name.toLowerCase().includes(normalizedSearchTerm) && (
//               <div>
//                 <h3>{item.name}</h3>
//                 <p>
//                   {item.startDate} - {item.endDate}
//                 </p>
//               </div>
//             )}
//           {'name' in item &&
//             'address' in item &&
//             item.name.toLowerCase().includes(normalizedSearchTerm) && (
//               <div>
//                 <h3>{item.name}</h3>
//                 <p>{item.address}</p>
//               </div>
//             )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SearchResults;

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
  locationId: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
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
            'address' in item &&
            (item.name.toLowerCase().includes(normalizedSearchTerm) ||
              item.address.toLowerCase().includes(normalizedSearchTerm)) && (
              <div>
                <h3>{item.name}</h3>
                <p>{item.address}</p>
              </div>
            )}
          {'name' in item &&
            'startDate' in item &&
            'endDate' in item &&
            item.name.toLowerCase().includes(normalizedSearchTerm) && (
              <div>
                <h3>{item.name}</h3>
                <p>
                  {item.startDate} - {item.endDate}
                </p>
              </div>
            )}
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
