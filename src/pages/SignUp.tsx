import React from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('올바른 이메일 형식이 아닙니다!')
      .required('이메일을 입력하세요!'),
    username: Yup.string()
      .min(2, '닉네임은 최소 2글자 이상입니다!')
      .max(10, '닉네임은 최대 10글자입니다!')
      .matches(
        /^[가-힣a-zA-Z][^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]*$/,
        '닉네임에 특수문자가 포함되면 안되고 숫자로 시작하면 안됩니다!',
      )
      .required('닉네임을 입력하세요!'),
    password: Yup.string()
      .min(8, '비밀번호는 최소 8자리 이상입니다')
      .max(16, '비밀번호는 최대 16자리입니다!')
      .required('패스워드를 입력하세요!')
      .matches(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[^\s]*$/,
        '알파벳, 숫자, 공백을 제외한 특수문자를 모두 포함해야 합니다!',
      )
  });

  const submit = async (values: {
    email: string;
    username: string;
    password: string;
  }) => {
    const { email, username, password } = values;
    try {
      await axios.post('/api/auth/signup', {
        email,
        username,
        password,
      });
      toast.success(
        <h3>
          회원가입이 완료되었습니다.
          <br />
          로그인 하세요😎
        </h3>,
        {
          position: 'top-center',
          autoClose: 2000,
        },
      );
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (e: any) {
      // 서버에서 받은 에러 메시지 출력
      toast.error(e.response.data.message + '😭', {
        position: 'top-center',
      });
    }
  };

  return (
    <Formik
      initialValues={{
        email: '',
        username: '',
        password: '',
        password2: '',
      }}
      validationSchema={validationSchema}
      onSubmit={submit}
      validateOnMount={true}
    >
      {({ values, handleSubmit, handleChange, errors }) => (
        <div className="max-w-sm mx-auto mt-8">
          <ToastContainer />
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <div className="text-red-500">{errors.email}</div>
            </div>
            <div className="mb-4">
              <label htmlFor="username" className="block mb-1">
                닉네임
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={values.username}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <div className="text-red-500">{errors.username}</div>
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-1">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <div className="text-red-500">{errors.password}</div>
            </div>
            <div className="mb-4">
              <label htmlFor="password2" className="block mb-1">
                비밀번호 확인
              </label>
              <input
                id="password2"
                name="password2"
                type="password"
                value={values.password2}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <div className="text-red-500">{errors.password2}</div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-2 bg-blue-500 text-white rounded ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              회원가입
            </button>
          </form>
        </div>
      )}
    </Formik>
  );
};

export default SignUp;
