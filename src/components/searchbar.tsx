import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useHistory를 이용하여 URL 변경

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  // URL 파라미터에서 검색어 추출하여 검색어 상태 업데이트
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchTermFromUrl = queryParams.get('q') || '';
    setSearchTerm(searchTermFromUrl);
  }, [location.search]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 검색 결과를 URL 파라미터로 전달하고 해당 페이지로 이동
    navigate(`/searchplace?q=${searchTerm}`);
  };

  return (
    <form
      className="flex items-center max-w-2xl mx-auto mt-24"
      onSubmit={handleSubmit}
    >
      <label htmlFor="simple-search" className="sr-only">
        Search
      </label>
      <div className="relative w-full">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none" />
        <input
          type="text"
          id="simple-search"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 font-BMJUA"
          placeholder="궁금한 여행지를 검색해보세요!"
          value={searchTerm} // 검색어 상태값을 value로 할당
          onChange={(e) => setSearchTerm(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <svg
          className="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
        <span className="sr-only">Search</span>
      </button>
    </form>
  );
};

export default SearchBar;
