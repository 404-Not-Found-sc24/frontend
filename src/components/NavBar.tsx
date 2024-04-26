import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const handleLogout = () => {
    setIsLogin(false);
  };

  const handleLogin = () => {
    setIsLogin(true);
  };

  return (
    <nav className="bg-white border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-3xl font-Dongle-Regular whitespace-nowrap text-main-green-color">
            나들이
          </span>
        </Link>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <div>
            {isLogin ? (
              <ul className="font-medium flex p-4 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
                <li>
                  <Link
                    to="/makediary"
                    className="pt-2 px-3 text-main-green-color font-BMJUA"
                  >
                    게시판
                  </Link>
                </li>
                <li>
                  <Link
                    to="/traveldes"
                    className="py-2 px-3 text-main-green-color font-BMJUA"
                  >
                    여행지
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="py-2 px-3 text-main-green-color font-BMJUA"
                  >
                    마이페이지
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    onClick={handleLogout}
                    className="py-2 px-3 border-2 border-white hover:border-main-green-color text-main-green-color font-BMJUA"
                  >
                    로그아웃
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
                <li>
                  <Link
                    to="/signup"
                    className="py-2 px-3 md:p-0 text-main-green-color font-BMJUA"
                  >
                    회원가입
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    onClick={handleLogin}
                    className="py-2 px-3 border-2 border-white hover:border-main-green-color text-main-green-color font-BMJUA"
                  >
                    로그인
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
