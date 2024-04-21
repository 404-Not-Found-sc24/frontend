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

  const addOutline = () => {
    const searchContainer = document.getElementById('search-container');
    if (searchContainer) {
      searchContainer.classList.add('border-2');
      searchContainer.classList.add('border-black');
    }
  };

  const removeOutline = () => {
    const searchContainer = document.getElementById('search-container');
    if (searchContainer) {
      searchContainer.classList.remove('border-2');
      searchContainer.classList.remove('border-black');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full h-12 flex justify-center my-3">
        <div
          className="w-11/12 h-full rounded-md shadow-xl flex items-center"
          id="search-container"
        >
          <input
            type="text"
            id="simple-search"
            className="text-gray-900 text-md rounded-lg block w-full ps-5 p-2.5 font-BMJUA focus:outline-0"
            placeholder="궁금한 여행지를 검색해보세요!"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            onFocus={addOutline}
            onBlur={removeOutline}
          />
          <button type="submit" className="search relative right-3"></button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
